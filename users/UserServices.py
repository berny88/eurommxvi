# -*- coding: utf-8 -*-
from flask import Blueprint, jsonify
import logging
from pymongo import MongoClient
from datetime import datetime
import os
import re

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
    logger.info(">>{}".format(jsonify({'users': users}).data))
    return jsonify({'users': users})

u"""
**************************************************
Service layer
"""


class UserManager(DbManager):

    def getAllUsers(self):
        """ get the complete list of properties"""
        localdb = self.getDb()
        logger.info(u'getProperties::db={}'.format(localdb))

        usersColl = localdb.users
        usersList = usersColl .find()
        logger.info(u'usersList={}'.format(usersList))
        #Faut-il changer de list ou retourner le bson directement ?
        result = list()


        users = [
            {
                'id': 1,
                'nickName': u'PoumPoum',
                'email': u'poum@poum.chak',
                'description': u'poum poum chak poum pouum chak',
            },
            {
                'id': 2,
                'nickName': u'chakChak',
                'email': u'poum@poum.chak',
                'description': u'poum poum chak poum pouum chak',
            },
        ]

        for user in usersList:
            logger.info(u'\tuser={}'.format(user))
            result.append(user)
        return users

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
