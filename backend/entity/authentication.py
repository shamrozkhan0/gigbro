from pydantic import BaseModel

class LoginUser(BaseModel):
    email: str
    password: str


class SignupUser(BaseModel):
    username: str
    email: str
    password: str
    is_premium_user: bool = False
    lite_report_limit: int = None
    full_report_limit: int = None
    projects: dict = None