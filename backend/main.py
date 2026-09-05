import json
from email import message

from fastapi import FastAPI, Response, Cookie, HTTPException
from entity.authentication import LoginUser, SignupUser
from fastapi.middleware.cors import CORSMiddleware
from services.jwt_token import verify_jwt
from database.database import Database
from database import database_utils
from ai.analyzer import Analyzer
from dotenv import load_dotenv
from pydantic import BaseModel
from entity.data import Data
import logging as log
import pymysql
import os

app = FastAPI()
load_dotenv()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL"), os.getenv("EXTENSION_ID")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

log.basicConfig(level=log.INFO, format='%(asctime)s - %(levelname)s - %(filename)s - %(message)s',)

@app.post("/signup")
def register_user(user: SignupUser):
    db = Database()
    response = db.register_user(user)
    return response


@app.post("/login")
def login_user(user: LoginUser, response: Response):
    log.info("| Reviewed Login request")
    db = Database()
    result = db.verify_user(user)

    if result["success"] == False:
        return result

    response.set_cookie(
        key="jwt_token",
        value= result["token"],
        # domain=f"{os.getenv('FRONTEND_URL')}", # it runs on local store
        httponly=True,
        secure=False,
        samesite="lax",
        max_age= 60 * 60 * 24 * 1
    )
    return result


@app.get("/me")
def get_me(jwt_token: str = Cookie(None)):
    if not jwt_token:
        log.error("| Error jwt token not found")
        raise HTTPException(401, "Not authenticated")
    user = verify_jwt(jwt_token)
    return user


@app.post("/logout")
def logout(response: Response):
    response.delete_cookie(key="jwt_token")
    log.info("| logout completed")
    return {"success": True, "message": "logout Successfully"}


@app.post("/savecontent")
def save_content(data: Data, jwt_token: str = Cookie()):
    if not jwt_token:
        raise HTTPException(401, "Token not found")
    user = verify_jwt(jwt_token)
    db = Database()
    result = db.setContent(data, user["user"])
    return {"success": True, "message": "Save successfully", "content_id": result["content_id"], "username": result["username"]}



class ContentRequest(BaseModel):
    username:str
    content_id:int

@app.get("/analyze/{username}/{content_id}")
def analyze(username:str, content_id:int, jwt_token=Cookie(...)):
    isLogin = verify_jwt(jwt_token)
    if not isLogin["success"]:
        return {"success": False, "message": "User is not authorized"}
    request = ContentRequest(username=username, content_id=content_id)
    db = Database()
    content = db.get_content_by_id(request.username, request.content_id)
    print("jnqrijcoivkowe")
    a = Analyzer(content["message"])
    result = a.get_response()
    print(result)
    db = Database()
    conn = db._connect_with_database()
    conn.close()
    report_id = db.save_report(username=username, title= content["message"]["title"], report=result)
    return { "success": True, "report_id": report_id }



@app.get("/{username}/getprojects")
def get_projects(username: str, jwt_token=Cookie(...)):
    if not verify_jwt(jwt_token):
        return {"success": False, "message": "User Not Login"}
    db = Database()
    reports = db.get_all_reports_by_username(username)
    return {
        "success" : True,
        "message" : reports
    }


@app.get("/getreport/{username}/{report_id}")
def get_report_if_exist(username:str, report_id:int, jwt_token: str = Cookie()):
    user = verify_jwt(jwt_token)

    try:
        if not user["success"]:
            return user

        db = Database()

        response = database_utils.get_report_by_id(
            db._connect_with_database(),
            db.report_table_name,
            report_id
        )

        if not response["success"]:
            return response


        report_username = response["username"]
        report = response["report"]

        if not (username == report_username) and not (username == user["username"]):
            return {
                "success" : False,
                "message" : "Your are not the respected owner"
            }

        return {
            "success" : True,
            "message" : json.loads(report)
        }

    except Exception as e:
        return ...




@app.get("/getdasboard/{username}/{id}")
def getUserDashboard(username:str, id:int, jwt:str = Cookie()):
    ...





# ==================== For testing =====================
@app.get("/get")
def z2lyze():
    query = f""" SELECT * FROM data"""
    db = Database()
    conn = db._connect_with_database()
    try:
       with conn.cursor(pymysql.cursors.DictCursor) as cursor:
           cursor.execute(query)
           content = cursor.fetchall()
           return content
    except pymysql.Error as e:
        log.error(f"| Error: {e}")


@app.get("/getreports")
def getReport():
    query = f""" SELECT * FROM reports """
    db = Database()
    conn = db._connect_with_database()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute(query)
            content = cursor.fetchall()
            return content
    except pymysql.Error as e:
        log.error(f"| Error: {e}")
