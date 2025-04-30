from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
import pandas as pd
import os
import re

app = Flask(__name__)

# Configure Gemini AI API
API_KEY = "AIzaSyB335UzzSBBxHj94igOEAThkn_G_uFP9UY"
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

conversation_history = []



def communication_func():
    try:
        df = pd.read_excel('./dataset/ratings.xlsx')
        topics = df['Topic'].tolist()
        ratings = df['Rating'].tolist()
    except FileNotFoundError:
        topics = []
        ratings = []
    return render_template('communication.html', topics=topics, ratings=ratings)

def start_conversation_func():
    global conversation_history
    conversation_history = []  # Reset conversation history

    # Reset the ratings.xlsx file by deleting it if it exists, then re-create it with headers only.
    file_path = "./dataset/ratings.xlsx"
    if os.path.exists(file_path):
        os.remove(file_path)
    
    # Create a new Excel file with just the header columns.
    columns = ["Topic", "Rating"]
    df_empty = pd.DataFrame(columns=columns)
    df_empty.to_excel(file_path, index=False)

    # Start the conversation with an initial prompt.
    start_prompt = "Start a friendly conversation about an interesting topic, like AI benefits."
    response = model.generate_content(start_prompt)
    ai_response = response.text.strip()
    
    conversation_history.append(("AI", ai_response))
    return jsonify({"ai_response": ai_response})

def process_speech_func():
    data = request.get_json()
    user_input = data["user_input"].strip()

    if not user_input:  # Avoid processing empty input.
        return jsonify({"ai_response": ""})

    # Append user’s input to the conversation history.
    conversation_history.append(("User", user_input))

    # Build the prompt using the full conversation history.
    ai_prompt = f"""
    Act like a friendly conversation partner who helps improve spoken English.
    - Provide a short, clear answer first.
    - Then ask a related question to keep the conversation going.
    - If the user doesn’t know something, explain briefly (1-2 sentences) before asking a follow-up.
    - Keep responses short and engaging.
    
    Conversation so far:
    {conversation_history}
    
    Respond concisely.
    """

    response = model.generate_content(ai_prompt)
    ai_response = response.text.strip()

    # Append the new AI response to conversation history.
    conversation_history.append(("AI", ai_response))
    return jsonify({"ai_response": ai_response})


def continue_conversation_func():
    full_context = "\n".join([f"{speaker}: {message}" for speaker, message in conversation_history])
    continue_prompt = f"The user has paused. Continue the conversation naturally based on this history:\n\n{full_context}"
    
    response = model.generate_content(continue_prompt)
    ai_response = response.text.strip()
    
    conversation_history.append(("AI", ai_response))
    return jsonify({"ai_response": ai_response})

def get_feedback_func():
    conversation_text = "\n".join([f"{speaker}: {message}" for speaker, message in conversation_history])
    feedback_prompt = f'''Analyze the following conversation and provide feedback on the user's communication skills:
    
{conversation_text}

Include ratings (out of 10) for the following areas:
1. Clarity & Pace
2. Pauses & Fillers
3. Grammatical Accuracy
4. Vocabulary Range
5. Word Choice & Precision
6. Fluency & Flow
7. Coherence & Organization
8. Ability to Express Ideas
9. Communication Style
10. Listening Skills
11. Adaptability

Then, summarize in the following format:
- **Suggestions to improve:** (1 sentence)
- **Weakness:** (1 sentence)
- **Strength:** (1 sentence)
- **Tips and tricks:** (1 sentence)'''

    response = model.generate_content(feedback_prompt)
    feedback = response.text.strip()

    # Use regex to capture rating lines from the response.
    pattern = r'\d+\.\s*(.*?)\s*[:\-–]\s*(\d+(?:\.\d+)?)'
    matches = re.findall(pattern, feedback)
    
    # Map the topics as desired
    topic_map = {
        'Clarity & Pace': 'Clarity & Pace',
        'Pauses & Fillers': 'Pauses & Fillers',
        'Grammatical Accuracy': 'Grammatical Accuracy',
        'Vocabulary Range': 'Vocabulary Range',
        'Word Choice & Precision': 'Precision',
        'Fluency & Flow': 'Fluency',
        'Coherence & Organization': 'Coherence',
        'Ability to Express Ideas': 'Expression',
        'Communication Style': 'Style',
        'Listening Skills': 'Listening',
        'Adaptability': 'Adaptability'
    }
    
    data = []
    for topic, rating in matches:
        topic = topic.strip()
        mapped_topic = topic_map.get(topic, topic)
        data.append({"Topic": mapped_topic, "Rating": float(rating)})
    
    file_path = "./dataset/ratings.xlsx"
    # Overwrite the Excel file with the new ratings for this feedback.
    df_new = pd.DataFrame(data)
    df_new.to_excel(file_path, index=False)
    
    # Extract only the summary section from the feedback text.
        # Process summary block
    summary_match = re.search(r"- \*\*Suggestions to improve:\*\*.*", feedback, re.DOTALL)
    if summary_match:
        summary_text = summary_match.group(0).strip()
        summary_lines = re.findall(r"- \*\*(.*?):\*\* (.*)", summary_text)

        # Build plain text (no HTML tags)
        # Build HTML string with bold labels
        structured_feedback = ""
        for label, value in summary_lines:
            structured_feedback += f"<b>{label}:</b> {value}<br>"

    else:
        structured_feedback = "Summary not found."


    return jsonify({"feedback": structured_feedback.replace('\n', '<br>')})



if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
