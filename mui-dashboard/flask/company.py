from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import math
import os
import google.generativeai as genai

from info import generate_milestone

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


# Configure Gemini API
API_KEY = "AIzaSyB335UzzSBBxHj94igOEAThkn_G_uFP9UY"  # Replace with your actual API key
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

# Load data
df = pd.read_excel("./dataset/Company_Details.xlsx")
df.fillna("Not available", inplace=True)

# Convert to dict for easy access
company_data = {row['Company']: row.to_dict() for _, row in df.iterrows()}

def get_companies_func():
    # Return list of companies with name and logo only
    companies = [{"name": row["Company"], "logo": row["Logo (link)"]} for _, row in df.iterrows()]
    return jsonify(companies)


def get_company_details_func(name):
    data = company_data.get(name)
    if data:
        return jsonify(data)
    else:
        return jsonify({"error": "Company not found"}), 404


def save_company_func():
    if request.method == "POST":
        # Expect JSON body with {"name": "..."}
        data = request.get_json()
        if not data:
            return jsonify({"error": "Missing JSON body"}), 400
        selected_name = data.get("name")
    else:
        # GET request: get name from query parameters
        selected_name = request.args.get("name")

    if not selected_name:
        return jsonify({"error": "No company name provided"}), 400

    # Load your Excel file
    df = pd.read_excel("./dataset/round.xlsx")

    # Filter rows by company name
    filtered_rows = df[df["company"] == selected_name]

    if filtered_rows.empty:
        return jsonify({"error": "Company not found"}), 404

    info = filtered_rows.iloc[0].to_dict()

    rounds = {}
    for i in range(1, 6):
        key = f"Round{i}"
        value = info.get(key, None)

        if pd.isna(value):
            rounds[key] = []
        else:
            if isinstance(value, str) and "$" in value:
                rounds[key] = [item.strip() for item in value.split("$") if item.strip()]
            else:
                rounds[key] = [value] if value else []

    # Optional: write rounds to a file
    with open("round.txt", "w") as file:
        for round_key, items in rounds.items():
            file.write(f"{round_key}:\n\n")
            if items:
                for item in items:
                    file.write(f"{item}\n")
            else:
                file.write("N/A\n")
            file.write("\n")
    info = {k: (None if pd.isna(v) or (isinstance(v, float) and math.isnan(v)) else v) for k, v in info.items()}

# Clean up NaN in rounds (if any)
    for k, v in rounds.items():
        rounds[k] = [None if pd.isna(item) or (isinstance(item, float) and math.isnan(item)) else item for item in v]
    # Return JSON response
    return jsonify({
        "info": info,
        "rounds": rounds
    })


def round_change_func():
    round1 = request.form.get("round1", "N/A")
    round2 = request.form.get("round2", "N/A")
    round3 = request.form.get("round3", "N/A")
    round4 = request.form.get("round4", "N/A")
    round5 = request.form.get("round5", "N/A")

    data = (
        f"Round1:\n\n{round1}\n\n"
        f"Round2:\n\n{round2}\n\n"
        f"Round3:\n\n{round3}\n\n"
        f"Round4:\n\n{round4}\n\n"
        f"Round5:\n\n{round5}"
    )

    try:
        with open("round.txt", "w", encoding="utf-8") as f:
            f.write(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify({"message": "Rounds saved successfully"})


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
        return jsonify({"success": True}), 200        # <-- send the actual plan
    return jsonify({"error": "Invalid request method. Use POST."}), 405

def milestone_func():
    return generate_milestone()


if __name__ == "__main__":
    app.run(debug=True)
