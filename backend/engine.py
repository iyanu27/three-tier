import os

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

# Postgres connection parameters

# PG_HOST = os.environ.get('PG_HOST', 'localhost')
# PG_USERNAME = os.environ.get('PG_USERNAME', 'postgres')
# PG_PASSWORD = os.environ.get('PG_PASSWORD', '')  # no password default
# PG_PORT = os.environ.get('PG_PORT', 5432)
# PG_DB = os.environ.get('PG_DB', 'app')
#
# engine = create_engine('postgresql+psycopg2://{}:{}@{}:{}/{}'.format(
#     PG_USERNAME,
#     PG_PASSWORD,
#     PG_HOST,
#     PG_PORT,
#     PG_DB
# ))

# For development purposes we're using sqlite
engine = create_engine('sqlite:////tmp/app.db')

Session = sessionmaker(bind=engine)
session = Session()
