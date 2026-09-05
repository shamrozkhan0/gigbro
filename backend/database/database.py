from entity.authentication import SignupUser
from services.jwt_token import create_token
from dotenv import load_dotenv
from . import database_utils
import logging as log
from os import getenv
import pymysql
import json


load_dotenv()
log.basicConfig(level=log.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",)


class Database:

    def __init__(self):
        self.auth_table_name = "user"
        self.data_table_name = "data"
        self.report_table_name = "reports"


    def _connect_with_database(self):
        try:
            connection = pymysql.connect(
                host="localhost",
                user="root",
                password=f"{getenv('MYSQL_PASSWORD')}",
                database=f"{getenv('MYSQL_DATABASE')}"
            )
            return connection
        except pymysql.Error as e:
            log.info(f"| Error connecting with Database {e}")
            return e


    def register_user(self, user : SignupUser):
        create_table_query = f"""CREATE TABLE {self.auth_table_name} (
                                id INT PRIMARY KEY AUTO_INCREMENT,
                                username VARCHAR(15) UNIQUE NOT NULL,
                                email VARCHAR(50) UNIQUE NOT NULL,
                                password VARCHAR(20) NOT NULL,
                                is_premium_user bool NOT NULL,
                                lite_report_limit INT NOT NULL,
                                full_report_limit INT NOT NULL,
                                projects json
                                )"""
        register_user_query = f"""INSERT INTO {self.auth_table_name} (username, email, password, is_premium_user, lite_report_limit, full_report_limit, projects) VALUES (%s, %s, %s, %s, %s, %s, %s)"""
        try:
            database_connection = self._connect_with_database()

            with database_connection.cursor() as cursor:

                if not database_utils.is_table_exist(database_connection, self.auth_table_name):
                    log.info(f"| Table '{self.auth_table_name}' does not exist in database")
                    cursor.execute(create_table_query)
                    log.info(f"| Success: created '{self.auth_table_name}' table in the database.")

                print("len of username", len(user.username))
                print("len of username", len(user.email))
                print("len of username", len(user.password))

                if (not user.username) or (not user.email) or (not user.password):
                    return {
                        "success" : False,
                        "message" : "Fill All Credentials first"
                    }

                if database_utils.check_if_user_exist_by_email(self.auth_table_name, database_connection, user.email):
                    return {
                        "success": False,
                        "message": f"User with email {user.email} already exist."
                    }

                if database_utils.check_if_username_exist_in_database(database_connection,self.auth_table_name, user.username):
                    return {
                        "success": False,
                        "message": f"Username already exist try a different username"
                    }

                cursor.execute(
                    register_user_query,
                    (
                        user.username,
                        user.email,
                        user.password,
                        False,
                        3,
                        0,
                        None
                ))
                log.info(f"| Successfully register a user with email {user.email}")

                database_connection.commit()
                database_connection.close()
                return {
                    "success": True,
                    "message": "Signup Completed"
                }

        except pymysql.Error as e:
            log.error(e)
            return {
                "success": False,
                "message": e,
            }


    def verify_user(self, user):
        verify_user_query = f"""SELECT email, password, username, is_premium_user FROM {self.auth_table_name} WHERE email = %s"""
        try:
            conn = self._connect_with_database()
            if not database_utils.check_if_user_exist_by_email(self.auth_table_name, conn, user.email):
                return {
                    "success": False,
                    "message": f"User with email {user.email} doesn't exist"
                }

            with conn.cursor() as cursor:
                cursor.execute(verify_user_query, (user.email,))
                email,password,username, is_premium_user = cursor.fetchone()
                conn.close()

                if user.password == password:
                    jwt_token = create_token(email, username, is_premium_user)
                    return {
                        "success": True,
                        "message": "Login Successfully",
                        "token": jwt_token
                    }

                return {
                    "success": False,
                    "message": "Email or password is incorrect."
                }

        except pymysql.Error as e:
            log.error(e)


    def setContent(self, data, user):
        table_query = f"""CREATE TABLE {self.data_table_name} (
            content_id INT PRIMARY KEY AUTO_INCREMENT,
            username VARCHAR(50) NOT NULL,
            url VARCHAR(150) NOT NULL,
            seller_status VARCHAR(10),
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            expertise JSON NOT NULL,
            category_and_subcategory VARCHAR(255) NOT NULL,
            packages JSON NOT NULL,
            tags TEXT NOT NULL,
            profile_description TEXT NOT NULL,
            ratings JSON,
            total_orders INT,
            gig_stars JSON,
            about_profile JSON NOT NULL
        )"""
        insert_content_query = f"""INSERT INTO {self.data_table_name} (
                username,
                url,
                seller_status,
                title,
                description,
                expertise,
                category_and_subcategory, 
                packages,
                tags,
                profile_description,
                ratings,
                total_orders,
                gig_stars,
                about_profile 
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) """
        conn = self._connect_with_database();
        try:
            with conn.cursor() as cursor:
                if not database_utils.is_table_exist(conn, self.data_table_name):
                    log.info("| Creating table for storing data.")
                    cursor.execute(table_query)
                    log.info(f"| Successfully created table '{self.data_table_name}'.")

                log.info("Inserting gig data into database")

                if type(data.ratings) == str:
                    data.ratings = {"message": data.ratings}

                if type(data.gig_stars) == str:
                    data.gig_stars = {"message": data.gig_stars}

                cursor.execute(
                    insert_content_query,
                    (
                        user["username"],
                        data.url,
                        data.seller_status,
                        data.title,
                        data.description,
                        json.dumps([e.model_dump() for e in data.expertise]),
                        data.category_and_subcategory,
                        json.dumps({k: v.model_dump() for k, v in data.packages.items()}),
                        data.tags,
                        data.profile_description,
                        json.dumps(data.ratings),
                        data.total_orders,
                        json.dumps(data.gig_stars),
                        json.dumps(data.seller_information)
                    )
                )
                conn.commit()
                content_id = cursor.lastrowid
            conn.close()
            return {"content_id": content_id, "username": user["username"]}
        except pymysql.Error as e:
            log.error(f"| Failed to upload gig content into database: {e}")
            return False


    def get_content_by_id(self, username, content_id):
        get_content_by_id_query = f"""SELECT * FROM {self.data_table_name} WHERE content_id = %s """
        conn = self._connect_with_database()
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute(get_content_by_id_query, (content_id,))
            content = cursor.fetchone()
            conn.close()
            if not content["username"] == username:
                return {"success": False, "message": "You are not The Owner"}
            content.pop("username")
            content.pop("content_id")
            return {"success": True, "message": content}


    def save_report(self, username, title, report):
        create_report_table_query = f""" CREATE TABLE {self.report_table_name} (
            report_id INT PRIMARY KEY AUTO_INCREMENT,
            username VARCHAR(15) NOT NULL,
            title VARCHAR(255) NOT NULL,
            report LONGTEXT,
            score INT NOT NULL,
            type VARCHAR(40) NOT NULL,
            analyzed_at DATE NOT NULL DEFAULT (CURRENT_DATE),
            FOREIGN KEY (username) REFERENCES `user`(username)
        )
        """
        insert_report_query = f""" INSERT INTO {self.report_table_name} (
            username,
            title,
            report,
            score,
            type
        )  VALUES (%s, %s, %s, %s,%s)"""
        try:
            conn = self._connect_with_database()
            with conn.cursor() as cursor:
                if not database_utils.is_table_exist(conn, self.report_table_name):
                    log.warning(f"| WARNING: Schema '{self.report_table_name}' does not exist")
                    cursor.execute(create_report_table_query)
                    log.info(f"| Success: Created schema '{self.report_table_name}'. ")
                    conn.commit()
                gig_score = report["scores"]["overall"]["score"]
                gig_type = report["meta"]["subcategory"].split(">")[-1]
                cursor.execute(insert_report_query, (username, title, json.dumps(report), gig_score, gig_type))
                conn.commit()
                report_id = cursor.lastrowid
                conn.close()
                return report_id
        except pymysql.Error as e:
            log.error(f"| Error: {e}")


    def get_all_reports_by_username(self, username):
        query = f""" SELECT report_id, title, score, type, analyzed_at FROM {self.report_table_name} WHERE username = %s """
        conn = self._connect_with_database()
        try:
            with conn.cursor() as cursor:
                cursor.execute(query, (username,))
                reports = cursor.fetchall()
                conn.close()
                return reports
        except pymysql.Error as e:
            log.error(f"| Error: {e}")