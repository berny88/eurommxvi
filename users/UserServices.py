# -*- coding: utf-8 -*-
from flask import Blueprint, jsonify, redirect, request
import logging
from pymongo import MongoClient
from datetime import datetime
import os
import re
import sendgrid

from tools.Tools import DbManager

logger = logging.getLogger(__name__)

u"""
**************************************************
ui layer
"""

users_page = Blueprint('users_page', __name__,
                       template_folder='templates', static_folder='static')


@users_page.route('/signon', methods=['GET'])
def signon():
    return users_page.send_static_file('logon.html')


@users_page.route('/users', methods=['GET'])
def userslist():
    u"""
    :return: static file (angular) to see / manager users
    """
    return users_page.send_static_file('users.html')


@users_page.route('/apiv1.0/users', methods=['GET'])
def getusers():
    mgr = UserManager()
    users = mgr.getAllUsers()
    logger.info("getusers::users={}".format(users))
    return jsonify({'users': users})

@users_page.route('/subscription', methods=['GET'])
def subscriptionGet():
    return users_page.send_static_file('logon.html')

@users_page.route('/subscription', methods=['POST'])
def subscriptionPost():
    logger.info("subscriptionPost")
    logger.info(u"request:{} / {}".format(request.args.get('target'), request.method))
    email = request.form['email']
    sg = sendgrid.SendGridClient("bbougeon138",
                "s8drhcp01")

    message = sendgrid.Mail()

    message.add_to(email)

    message.add_to("bernard.bougeon@gmail.com")
    message.add_to("guedeu.stephane@gmail.com")
    message.set_from("bernard.bougeon@gmail.com")
    message.set_subject("euroxxxvi - subscription confirmation")
    message.set_html("<html><head></head><body><h1>blablabla</h1><h1><a href=\"/\">Confirmation</a></h1></hr></body></html>")

    sg.send(message)

    return users_page.send_static_file('logon_successfull.html')


u"""
**************************************************
Service layer
"""

class User:

    def __init__(self):
        self.description = u""
        self.email = u""
        self.nickName = u""


    def convertFromBson(self, elt):
        """
        convert a User object from mongo
        """
        self.description = elt['description']
        self.email = elt['email']
        self.nickName = elt['nickName']
        #self._id = elt['_id']

    def convertIntoBson(self):
        """
        convert a User object into mongo Bson format
        """
        elt = dict()
        #elt['_id'] = self._id
        elt['description'] = self.description
        elt['email'] = self.email
        elt['nickName'] = self.nickName
        return elt

class UserManager(DbManager):

    def getAllUsers(self):
        """ get the complete list of properties"""
        localdb = self.getDb()
        logger.info(u'getAllUsers::db={}'.format(localdb))

        usersColl = localdb.users
        usersList = usersColl.find()
        logger.info(u'getAllUsers::usersList={}'.format(usersList))
        #Faut-il changer de list ou retourner le bson directement ?
        result = list()

        for userbson in usersList:
            logger.info(u'\tgetAllUsers::userbson={}'.format(userbson))
            user = User()
            user.convertFromBson(userbson)
            logger.info(u'\tgetAllUsers::user={}'.format(user))
            tmpdict = user.__dict__
            logger.info(u'\tgetAllUsers::tmpdict={}'.format(tmpdict))
            result.append(tmpdict)
        return result

    def saveUser(self, key, value):
        """ save a user"""
        #localdb = self.getDb()
        # TODO

    def getUser(self, email):
        """ get one property by key"""
        localdb = self.getDb()
        logger.info(u'getUser::db={}'.format(localdb))

        usersColl = localdb.users
        bsonUser = usersColl.find_one({"email": email})
        return bsonUser
