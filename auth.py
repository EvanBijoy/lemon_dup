import jwt
from flask import Flask

app = Flask(__name__)

app.config['SECRET_KEY'] = 'your_secret_key'

def generate_token(email):
    token = jwt.encode({'email': email}, app.config['SECRET_KEY'], algorithm='HS256')
    print(token)
    return token


def validate_token(token):
    if not token:
        return None

    try:
        decoded_token = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        email = decoded_token['email']
        return email
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None