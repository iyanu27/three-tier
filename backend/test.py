import unittest
import json
import http.cookies
from flask import url_for
import app


class TestApp(unittest.TestCase):
    def setUp(self):
        app.app.config['TESTING'] = True
        self.test_client = app.app.test_client()

    def test_require_username(self):
        res = self.test_client.post('/user/login', json=dict(foo='bar'))
        message = json.loads(res.data.decode())['message']

        assert message == "The username parameter is missing."
        assert res.status_code == 400

    def test_require_password(self):
        res = self.test_client.post('/user/login', json=dict(username='foo'))
        message = json.loads(res.data.decode())['message']

        assert message == "The password parameter is missing."
        assert res.status_code == 400

    def test_invalid_password(self):
        res = self.test_client.post('/user/login', json=dict(username='demo', password='bar'))
        message = json.loads(res.data.decode())['message']

        assert message == "The username or password is incorrect."
        assert res.status_code == 401

    def test_correct_login(self):
        res = self.test_client.post('/user/login', json=dict(username='demo', password='demo'))
        user = json.loads(res.data.decode())['user']
        self.assertDictEqual(user, {'firstName': 'Kevin', 'lastName': 'Rivers'})

        assert res.status_code == 200

        cookie_value = http.cookies.SimpleCookie(res.headers['Set-Cookie'])
        return cookie_value.get('session').value

    def test_incorrect_status(self):
        res = self.test_client.get('/user/status')
        assert res.status_code == 401

    def test_correct_status(self):
        session_cookie = self.test_correct_login()
        res = self.test_client.get('/user/status', headers=dict(cookie='session={}'.format(session_cookie)))
        user = json.loads(res.data.decode())['user']
        self.assertDictEqual(user, {'firstName': 'Kevin', 'lastName': 'Rivers'})

        assert res.status_code == 200


if __name__ == '__main__':
    unittest.main()
