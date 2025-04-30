import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS

from task import combine  # Assuming combine() returns JSON response with plan data

app = Flask(__name__)
CORS(app)

# Configure Gemini API
API_KEY = "AIzaSyB335UzzSBBxHj94igOEAThkn_G_uFP9UY"  # Replace with your actual API key
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")


def parse_rounds(file_path):
    rounds = {}
    try:
        with open(file_path, 'r') as file:
            content = file.read()
    except FileNotFoundError:
        return {"error": f"File {file_path} not found."}

    current_round = None
    for line in content.splitlines():
        line = line.strip()
        if not line:
            continue
        if line.startswith("Round"):
            current_round = line.rstrip(":")
            rounds[current_round] = []
        elif current_round:
            rounds[current_round].append(line)
    return rounds


def generate_milestone():
    if request.method == 'POST':
        try:
            aptitude = float(request.form.get('aptitude', 0))
            dsa = float(request.form.get('dsa', 0))
            weeks = int(request.form.get('weeks', 0))

        except (ValueError, TypeError):
            return jsonify({"error": "Invalid input."}), 400

        if weeks <= 0:
            return jsonify({"error": "Weeks must be a positive integer."}), 400

        days = weeks * 7

        rounds = parse_rounds('round.txt')
        if "error" in rounds:
            return jsonify({"error": rounds["error"]}), 400

        prompt = (
            f"Create a detailed and realistic daily milestone study plan for {days} days.\n\n"
            f"Total study hours: Aptitude = {aptitude} hrs, DSA = {dsa} hrs.\n\n"
            f"Distribute and cover the following topics over the days, grouped by interview rounds:\n\n"
            f"{rounds}\n\n"
            "Ensure the topics and hours are evenly distributed. "
            "Make sure the plan helps in preparing for all rounds mentioned above. Format the output clearly, day by day. "
            "Give it as tables for each week.\n\n"
            "The tables should follow only this format:\n"
            "Week 1\n"
            "Day | Hours | Topics | Round | Notes |\n\n"
            f"Give tables up to {weeks} weeks.\n\n"
            "Give hours as value only. Don't give like this 4 hrs. Give 4. Give Days as value only. Don't give like this Day 1. Give 1.\n\n"
            "The Notes should show all things to learn separated by commas. Each topic before the comma should be a separate task.\n\n"
        )

        try:
            response = model.generate_content(prompt)
            markdown_text = response.text

            # Save the markdown text to task.md for further processing
            with open('task.md', 'w', encoding='utf-8') as f:
                f.write(markdown_text)

        except Exception as e:
            return jsonify({"error": f"Gemini API error: {str(e)}", "type": "api"}), 500

        # Return combined JSON data (from task.py's combine function)
        plan_data = combine()            # <-- call your parser
        return jsonify(plan_data)        # <-- send the actual plan
    return jsonify({"error": "Invalid request method. Use POST."}), 405


# --- Robust JSON error handlers for API consistency ---

@app.errorhandler(404)
def handle_404(e):
    return jsonify({"error": "Not Found", "message": "The requested resource was not found."}), 404


@app.errorhandler(405)
def handle_405(e):
    return jsonify({"error": "Method Not Allowed", "message": "The method is not allowed for the requested URL."}), 405


@app.errorhandler(500)
def handle_500(e):
    return jsonify({"error": "Internal Server Error", "message": "An unexpected error occurred."}), 500



if __name__ == '__main__':
    app.run(debug=True)
