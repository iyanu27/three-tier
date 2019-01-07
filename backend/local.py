# This script creates the database, tables and demo user for local development

# Create the demo user
from sqlalchemy.exc import IntegrityError
from sqlalchemy_utils import database_exists, create_database
import bcrypt

from engine import Base, engine, session
from db.users import Users

# Create the database if it doesn't exist
if not database_exists(engine.url):
    create_database(engine.url)

# Create the user table
Base.metadata.create_all(engine)

# Create the user with id 1
DEMO = {
    'id': 1,
    'username': 'demo',
    'password': 'demo',
    'first_name': 'Kevin',
    'last_name': 'Rivers'
}

# Hash user password with bcrypt(12)
DEMO['password'] = bcrypt.hashpw(DEMO['password'].encode(), bcrypt.gensalt()).decode()

u = Users(**DEMO)
session.add(u)

try:
    session.commit()
except IntegrityError:
    # We  have already added the demo user with id 1
    pass
