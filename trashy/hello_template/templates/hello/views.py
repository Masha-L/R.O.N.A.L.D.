from templates import app
from flask import render_template
@app.route('/')
@app.route('/hello')

from flask import render_template, Blueprint
hello_blueprint = Blueprint('hello',__name__)
@hello_blueprint.route('/')
@hello_blueprint.route('/hello')

def index():
 return render_template("index.html")