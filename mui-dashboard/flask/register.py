from flask import Flask, jsonify, request, url_for
from flask_cors import CORS
from openpyxl import load_workbook

app = Flask(__name__)
CORS(app)  # Allow requests from React

EXCEL_FILE = "./dataset/register.xlsx"

def register_func():
    data = request.get_json()
    email = data.get("email")
    name = data.get("name")
    password = data.get("password")

    try:
        wb = load_workbook(EXCEL_FILE)
        sheet = wb.active
        sheet.append([email, name, password, "", "", "", "", "", ""])
        wb.save(EXCEL_FILE)

        return jsonify({
            "message": "Registered successfully!",
            "redirect": url_for('personal', email=email)
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/personal')
def personal():
    email = request.args.get('email')
    return f"Welcome {email}! 🎉"

if __name__ == '__main__':
    app.run(debug=True)
