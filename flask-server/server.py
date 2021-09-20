from flask import Flask

app = Flask(__name__)

@app.route("/members")
def members():
    return {"members": [f"Member{i+1}" for i in range(3)]}

if __name__ == "__main__":
    app.run(debug=True)