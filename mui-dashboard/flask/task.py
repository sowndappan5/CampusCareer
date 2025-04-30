import re
from flask import Flask, json, request, jsonify
from flask_cors import CORS
import pandas as pd
import google.generativeai as genai
from googleapiclient.discovery import build

app = Flask(__name__)
CORS(app)

GEMINI_API_KEY = "AIzaSyB335UzzSBBxHj94igOEAThkn_G_uFP9UY"
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

# ----- YouTube API configuration -----
YOUTUBE_API_KEY = 'AIzaSyCPg_l31cGQ-ybHfdsgOHpnPEkDRj5K_-A'  # Replace with your actual YouTube API key
YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search'

def parse_markdown():
    try:
        with open('task.md', 'r') as f:
            content = f.read()
    except Exception as e:
        # Log and re-raise or return an error indicator
        print("Error reading task.md:", e)
        raise e  # or return {}

    weeks = {}
    try:
        matches = re.findall(r"\*\*Week (\d+)\*\*\s*\n(.*?)(?=\*\*Week \d+\*\*|\Z)", content, re.DOTALL)
        for week_num, table_content in matches:
            tasks = []
            lines = table_content.strip().split('\n')

            if len(lines) > 2:
                data_rows = lines[2:]  
                for row in data_rows:
                    cols = [col.strip() for col in row.split('|')]
                    if len(cols) >= 6:
                        try:
                            day = int(cols[1].strip())
                            hours = int(cols[2].strip())
                        except ValueError:
                            continue  

                        topic = cols[3].strip()
                        round = cols[4].strip()
                        notes_string  = cols[5].strip()
                        notes_list  = [note.strip() for note in notes_string .split(',')]


                        tasks.append({
                            "day": day,
                            "topic": topic,
                            "hours": hours,
                            "notes": notes_list ,
                            "round": round,
                            "is_rest": topic.lower() == 'rest' or hours == 0
                        })
            weeks[int(week_num)] = tasks
    except Exception as e:
        print("Error while parsing markdown content:", e)
        raise e

    return weeks

def load_chart_data():
    try:
        df = pd.read_excel("bar.xlsx")
        labels = df['Days'].tolist()
        values = df['Score'].tolist()
        return labels, values
    except Exception as e:
        print("Error reading bar.xlsx:", e)
        raise e


def combine():
    try:
        weeks = parse_markdown()
        labels, values = load_chart_data()
        return jsonify({
            "weeks": weeks,
            "labels": labels,
            "values": values
        })
    except Exception as e:
        # This will return an error message as JSON instead of a blank page.
        return jsonify({"error": str(e)}), 500
    
def process_multiple_topics(notes):
    """
    Splits a notes string into individual topics and fetches videos for each topic.
    """
    # Split notes into individual topics
    topics = []
    
    # Try to identify topics by comma separation first
    if ',' in notes:
        topics = [topic.strip() for topic in notes.split(',')]
    # Also check for topics separated by other delimiters
    elif '-' in notes:
        topics = [topic.strip() for topic in notes.split('-')]
    # If there are line breaks, those might be topic separators
    elif '\n' in notes:
        topics = [topic.strip() for topic in notes.split('\n')]
    # Look for common separators like 'and', '&', etc.
    elif ' and ' in notes:
        topics = [topic.strip() for topic in notes.split(' and ')]
    else:
        # Try to identify topics in a more complex string
        # Use Gemini to help split the content into topics
        prompt = (
            f"Split the following technical topic into individual, distinct topics (max 4):\n"
            f"'{notes}'\n"
            "Return ONLY a comma-separated list of individual topics, with no additional text."
        )
        response = model.generate_content(prompt)
        topics = [topic.strip() for topic in response.text.strip().split(',')]
    
    # Process each topic individually
    all_video_results = {}
    for topic in topics:
        if not topic:  # Skip empty topics
            continue
            
        # Generate a search query for this specific topic
        search_query = f"{topic} explained for beginners placement preparation"
        
        # Fetch videos for this topic
        videos = fetch_youtube_videos(search_query, max_results=2)
        
        # Add to results with the topic as the key
        all_video_results[topic] = videos
    
    return all_video_results

def generate_search_queries(notes):
    """
    Uses Google Generative AI (Gemini) to generate concise YouTube search queries 
    focused on quality educational content.
    """
    prompt = (
        f"Generate exactly 2 highly specific YouTube search queries based on this note:\n"
        f"'{notes}'\n"
        "Return ONLY 2 queries as a comma-separated list without explanation.\n"
        "Focus on search terms that would find comprehensive, well-explained content.\n"
        "Target educational videos for engineering students preparing for placement with high ratings,"
        "well-known youtube educators, or popular technical channels.\n"
        "The videos should be suitable for college students preparing for placements with limited time,"
        "in English language, and covering core concepts thoroughly.\n"
        "Add terms like 'explained', 'tutorial', 'visualization', or 'beginner friendly' to improve results.\n"
        "For example, instead of just 'sorting algorithms', use 'best sorting algorithms tutorial for interviews'"
    )
    response = model.generate_content(prompt)
    text = response.text.strip()
    queries = [q.strip() for q in text.split(',') if q.strip()]
    if len(queries) > 2:
        queries = queries[:2]  # Only take the first 2
    elif len(queries) < 2:
        # If we have less than 2, add a generic backup query
        if len(queries) == 0:
            queries = [f"{notes} tutorial for beginners", f"best {notes} explained for placement"]
        else:
            # We have 1 query, add a second one
            queries.append(f"best {notes} tutorial for placement preparation")
    
    return queries


def fetch_youtube_videos(query, max_results=2):
    """Fetches EXACTLY 2 highest quality videos from YouTube API."""
    youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)
    
    # Search for videos
    search_request = youtube.search().list(
        part='snippet',
        q=query,
        type='video',
        maxResults=10,  # Fetch more initially
        order='relevance'
    )
    search_response = search_request.execute()
    
    # Get video IDs for detailed statistics
    video_ids = [item['id']['videoId'] for item in search_response['items']]
    
    videos_with_stats = []
    if video_ids:
        video_request = youtube.videos().list(
            part='statistics,contentDetails',
            id=','.join(video_ids)
        )
        video_response = video_request.execute()
        
        for search_item in search_response['items']:
            video_id = search_item['id']['videoId']
            stats = next((item for item in video_response['items'] if item['id'] == video_id), None)
            
            if stats:
                # Calculate quality factors
                try:
                    view_count = int(stats['statistics'].get('viewCount', 0))
                    like_count = int(stats['statistics'].get('likeCount', 0))
                except (ValueError, TypeError):
                    view_count = 0
                    like_count = 0
                
                # Skip videos with very few views
                if view_count < 1000:
                    continue
                
                # Calculate quality score with multiple factors
                quality_score = (view_count * 0.4) + (like_count * 0.4)
                
                # Get duration and adjust score accordingly
                duration = stats['contentDetails'].get('duration', '')
                minutes = 0
                if 'M' in duration:
                    minutes_match = re.search(r'(\d+)M', duration)
                    if minutes_match:
                        minutes = int(minutes_match.group(1))
                
                # Prefer medium-length videos (7-15 minutes)
                if 7 <= minutes <= 15:
                    quality_score *= 1.5
                elif minutes < 5:
                    quality_score *= 0.6  # Too short for in-depth learning
                elif minutes > 25:
                    quality_score *= 0.5  # Too long for quick learning
                
                # Add to results
                videos_with_stats.append({
                    'id': video_id,
                    'title': search_item['snippet']['title'],
                    'thumbnail': search_item['snippet']['thumbnails']['medium']['url'],
                    'url': f'https://www.youtube.com/watch?v={video_id}',
                    'viewCount': view_count,
                    'likeCount': like_count,
                    'duration': duration,
                    'channel': search_item['snippet']['channelTitle'],
                    'quality_score': quality_score
                })
        
        # Sort by quality score and strictly limit to max_results
        videos_with_stats.sort(key=lambda x: x['quality_score'], reverse=True)
        return videos_with_stats[:max_results]  # This ensures exactly max_results videos
    
    return []



def get_videos_func(week, day):
    """
    Fetches YouTube video suggestions for a specific task and returns them as JSON.
    """
    weeks = parse_markdown()
    task = next((t for t in weeks.get(week, []) if t['day'] == day), None)
    if not task:
        return jsonify({"error": "Task not found"}), 404

    # Process each topic separately
    video_results = process_multiple_topics(task['notes'])
    
    print(f"Requested Week: {week}, Day: {day}, Topics: {list(video_results.keys())}")
    return jsonify(video_results)

if __name__ == '__main__':
    app.run(debug=True)
