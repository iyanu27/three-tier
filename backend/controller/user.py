from sqlalchemy.orm.exc import NoResultFound
import bcrypt

from engine import session
from db.users import Users


# Create a custom exception
class UserNotFoundException(Exception):
    pass


class UserController:
    # If a user id is provided, most likely from the user session, the user object will be fetched
    def __init__(self, user_id=None, user=None):
        assert user_id is not None or user is not None, "either the user object or user id must be provided"

        if user_id:
            self.user = session.query(Users).get(user_id)
        else:
            self.user = user

    @staticmethod
    def login(username, password):
        try:
            user = session.query(Users).filter(Users.username == username).one()
        except NoResultFound:
            raise UserNotFoundException

        if bcrypt.checkpw(password.encode(), user.password.encode()):
            return UserController(user=user)
        else:
            raise UserNotFoundException
