# app.py
from flask import Flask, jsonify, request, send_from_directory, abort
from flask_cors import CORS
import json, os, pandas as pd, re, logging
import google.generativeai as genai

app = Flask(__name__, static_folder='build', static_url_path='/')
CORS(app)
logging.basicConfig(level=logging.DEBUG)

# ----- Configure Gemini -----
API_KEY = "AIzaSyB335UzzSBBxHj94igOEAThkn_G_uFP9UY"
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

def parse_markdown():
    with open('task.md') as f:
        content = f.read()
    weeks = {}
    matches = re.findall(r"\*\*Week (\d+)\*\*\s*\n(.*?)(?=\*\*Week \d+\*\*|\Z)", content, re.DOTALL)
    for week_num, table in matches:
        tasks = []
        lines = table.strip().split('\n')
        for row in lines[2:]:
            cols = [c.strip() for c in row.split('|')]
            if len(cols) >= 6:
                try:
                    day = int(cols[1]); hours = int(cols[2])
                except:
                    continue
                tasks.append({
                    'day': day,
                    'notes': cols[5].strip(),
                })
        weeks[int(week_num)] = tasks
    return weeks

def get_assessment_func(week, day):
    weeks = parse_markdown()
    task = next((t for t in weeks.get(week, []) if t['day'] == day), None)
    if not task:
        return abort(404, 'Task not found')
    # Generate questions once per request
    prompt = (
        f"Generate 10 multiple choice questions for an assessment based on the following task notes:\n"
        f"'{task['notes']}'\n"
        "Each with options A–D, JSON list of {question, options, answer}."
    )
    resp = model.generate_content(prompt)
    raw = resp.text.strip().lstrip("```json").rstrip("```")
    print("=== Gemini Raw Response Start ===")
    print(resp.text)
    print("=== Gemini Raw Response End ===\n")
    questions = json.loads(raw)
    return jsonify({'questions': questions})

def post_assessment_func():
    data = request.get_json()
    week, day = data.get('week'), data.get('day')
    answers = data.get('answers', {})
    # re-parse for correct answers
    weeks = parse_markdown()
    task = next((t for t in weeks.get(week, []) if t['day'] == day), None)
    if not task:
        return abort(404)
    # Regenerate same questions to know correct answers (or cache in real app)
    # For brevity, assume client sent back 'answer' in payload too.
    questions = data.get('questions') or []
    total = len(questions)
    correct = sum(
        1 for i,q in enumerate(questions)
        if answers.get(str(i), '').upper() == q.get('answer','').upper()
    )
    score = int((correct/total)*100) if total else 0

    # update bar.xlsx
    if os.path.exists('bar.xlsx'):
        df = pd.read_excel('bar.xlsx')
    else:
        df = pd.DataFrame(columns=['Days','Score'])
    if day in df['Days'].values:
        df.loc[df['Days']==day,'Score'] = score
    else:
        df = pd.concat([df, pd.DataFrame({'Days':[day],'Score':[score]})], ignore_index=True)
    df.to_excel('bar.xlsx', index=False)

    return jsonify({'score': score})

# Serve React in prod

def serve_func(path):
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
