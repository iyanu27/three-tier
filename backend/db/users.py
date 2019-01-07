from sqlalchemy import Column, Integer, String

from engine import Base


class Users(Base):
    __tablename__ = 'app_users'

    id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False)
    password = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
