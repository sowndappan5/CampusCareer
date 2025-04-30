from flask import Flask, jsonify, request, url_for
from flask_cors import CORS
from openpyxl import load_workbook

from login import login_func
from register import register_func
from personal import get_colleges_func, get_details_func, submit_func
from company import (
    get_companies_func,
    get_company_details_func,
    save_company_func,
    milestone_func,
    round_change_func
)
from task import combine, get_videos_func
from assessment import (
    get_assessment_func,
    post_assessment_func,
    serve_func
)
from chat import (
    communication_func,
    start_conversation_func,
    process_speech_func,
    continue_conversation_func,
    get_feedback_func
)

app = Flask(__name__)
CORS(app)

@app.route('/login', methods=['POST'])
def login():
    return login_func()

@app.route('/register', methods=['POST'])
def register():
    return register_func()

@app.route("/api/get_colleges", methods=["GET"])
def get_colleges():
    return get_colleges_func()

@app.route("/api/get_details", methods=["POST"])
def get_details():
    return get_details_func()

@app.route("/api/submit", methods=["POST"])
def submit():
    return submit_func()

@app.route('/personal')
def personal():
    email = request.args.get('email')
    return f"Welcome {email}! 🎉"

@app.route("/company", methods=["GET"])
def company():
    return get_companies_func()

@app.route("/company/<name>", methods=["GET"])
def get_company_details(name):
    return get_company_details_func(name)

@app.route("/save_company", methods=["GET", "POST"])
def save_company():
    return save_company_func()

@app.route("/changed", methods=["POST"])
def changed():
    return round_change_func()

@app.route("/api/milestone", methods=["POST"])
def milestone():
    return milestone_func()

@app.route('/api/combine', methods=['GET'])
def combine_func():
    return combine()

@app.route('/videos/<int:week>/<int:day>')
def get_videos(week, day):
    return get_videos_func(week, day)

@app.route('/api/assessment/<int:week>/<int:day>', methods=['GET'])
def get_assessment(week, day):
    return get_assessment_func(week, day)

@app.route('/api/assessment', methods=['POST'])
def post_assessment():
    return post_assessment_func()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def server(path):
    return serve_func(path)

@app.route('/communication')
def communication():
    return communication_func()

@app.route("/start")
def start_conversation():
    return start_conversation_func()

@app.route("/process", methods=["POST"])
def process_speech():
    return process_speech_func()

@app.route("/continue")
def continue_conversation():
    return continue_conversation_func()

@app.route("/feedback")
def get_feedback():
    return get_feedback_func()

if __name__ == '__main__':
    app.run(debug=True)
