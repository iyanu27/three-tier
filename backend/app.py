import os
import time

from flask import Flask, session, jsonify, request, send_from_directory, Response

from controller.user import UserController, UserNotFoundException

app = Flask(__name__)

# Secret string used to encrypt session cookies uses APP_SECRET environment variable or 'secret-string' if not set
app.secret_key = os.environ.get('APP_SECRET', 'secret-string')
app.config['MODE'] = os.environ.get('APP_MODE', 'development')


@app.before_request
def before_request():
    if app.config['MODE'] == 'production':
        time.sleep(1)  # Simulate network delay


@app.route('/dist/<path:path>')
def send_file(path):
    root_dir = os.path.dirname(os.getcwd())
    return send_from_directory(os.path.join(root_dir, 'dist'), path)


@app.route('/user/status')
def user_status():
    try:
        user_id = session['user_id']
    except KeyError:
        return '', 401

    if type(user_id) is not int:
        return '', 401

    u = UserController(user_id)
    return jsonify({'user': {'firstName': u.user.first_name, 'lastName': u.user.last_name}})


@app.route('/user/login', methods=['POST'])
def user_login():
    # Get the posted body as a dictionary
    body = request.get_json()
    if body is None:
        return jsonify({'message': 'Invalid request.'}), 400  # Bad request

    try:
        username = body['username']
    except KeyError:
        return jsonify({'message': 'The username parameter is missing.'}), 400  # Bad request

    try:
        password = body['password']
    except KeyError:
        return jsonify({'message': 'The password parameter is missing.'}), 400  # Bad request

    try:
        u = UserController.login(username, password)
    except UserNotFoundException:
        return jsonify({'message': 'The username or password is incorrect.'}), 401  # Unauthorized

    session['user_id'] = u.user.id
    return jsonify({'user': {'firstName': u.user.first_name, 'lastName': u.user.last_name}})


@app.route('/user/logout', methods=['POST'])
def user_logout():
    # Reset the session on logout
    session.clear()
    return '', 201


@app.route('/')
def index_route():
    print('index!')
    root_dir = os.path.dirname(os.getcwd())
    return app.send_static_file('index.html'.format(root_dir))


if __name__ == '__main__':
    app.run(port=8085, debug=app.config['MODE'] == 'development',
            host='127.0.0.1' if app.config['MODE'] == 'development' else '0.0.0.0')
