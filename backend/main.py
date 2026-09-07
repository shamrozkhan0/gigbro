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
import json
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
    print("called")
    isLogin = verify_jwt(jwt_token)
    if not isLogin["success"]:
        return {"success": False, "message": "User is not authorized"}
    request = ContentRequest(username=username, content_id=content_id)
    db = Database()
    content = db.get_content_by_id(request.username, request.content_id)
    a = Analyzer(content["message"])
    result = a.get_response()
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


@app.get("/reportexist/{username}/{report_id}")
def check_if_report_exists(
    username: str,
    report_id: int,
    jwt_token: str = Cookie()
):
    try:
        user = verify_jwt(jwt_token)

        if not user["success"]:
            return {
                "success": False,
                "message": "Login First"
            }

        db = Database()

        response = database_utils.get_report_by_id(
            db._connect_with_database(),
            db.report_table_name,
            report_id
        )

        if not response["success"]:
            return {
                "success": True,
                "exists": False,
                "message": "Report is not ready yet"
            }

        report_username = response["username"]
        print("reportusername",report_username)
        print("user",user)
        if username != report_username or username != user["user"]["username"]:
            log.warning(
                "Unauthorized report access: username=%s report_id=%s",
                username,
                report_id
            )

            return {
                "success": False,
                "message": "You are not the owner of this report"
            }

        return {
            "success": True,
            "exists": True,
            "message": "Report exists"
        }

    except Exception:
        log.exception(
            "Error checking report existence: report_id=%s",
            report_id
        )

        return {
            "success": False,
            "message": "Something went wrong"
        }


@app.get("/getreport/{username}/{report_id}")
def get_report(
    username: str,
    report_id: int,
    jwt_token: str = Cookie()
):
    try:

        user = verify_jwt(jwt_token)
        print(user)
        if not user["success"]:
            return {
                "success": False,
                "message": "Login First"
            }

        db = Database()

        response = database_utils.get_report_by_id(
            db._connect_with_database(),
            db.report_table_name,
            report_id
        )

        if not response["success"]:
            return response

        report_username = response["username"]

        if username != report_username or username != user["user"]["username"]:
            log.warning(
                "Unauthorized report access: username=%s report_id=%s",
                report_id,
                username
            )

            return {
                "success": False,
                "message": "You are not the owner of this report"
            }

        report = response["report"]

        return {
            "success": True,
            "message": json.loads(report)
        }

    except Exception:
        log.exception(
            "Error retrieving report: report_id=%s",
            report_id
        )

        return {
            "success": False,
            "message": "Something went wrong"
        }







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
