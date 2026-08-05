import logging as log
import pymysql

log.basicConfig(level=log.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",)


def check_if_user_exist_by_email(table_name, conn, email):
    verify_user_query = f"""SELECT EXISTS(SELECT 1 FROM {table_name} WHERE email = %s) AS email_exists"""
    with conn.cursor() as cursor:
        cursor.execute(verify_user_query, (email,))
        is_exist = cursor.fetchone()
        return is_exist[0]


def check_if_username_exist_in_database(conn,table_name, username):
    query = f""" SELECT EXISTS(SELECT 1 FROM {table_name} WHERE username = %s) AS username_exists """
    with conn.cursor() as cursor:
        cursor.execute(query, (username,))
        is_exist = cursor.fetchone()
        return is_exist[0]


def get_id_by_email(conn, table_name, email):
    get_id_by_email_query = f"""SELECT id FROM {table_name} WHERE email = %s"""
    try:
        with conn.cursor() as cursor:
            cursor.execute(get_id_by_email_query, (email,))
            return cursor.fetchone()
    except pymysql.Error as e:
        log.info(e)


def get_username_by_id(conn, table_name, id):
    get_username_by_id_query = f"""SELECT username FROM {table_name} WHERE id = %s"""
    try:
        with conn.cursor() as cursor:
            cursor.execute(get_username_by_id_query, (id,))
            return cursor.fetchone()
    except pymysql.Error as e:
        log.info(e)


def is_table_exist(conn, table_name: str):
    is_table_exist_query = f"""SHOW TABLES LIKE %s"""
    try:
        with conn.cursor() as cursor:
            cursor.execute(is_table_exist_query, (table_name,))
            result = cursor.fetchone()
            return True if result else False
    except pymysql.Error as e:
        log.info(f"| Error while checking if database exist {e} ")
        return e