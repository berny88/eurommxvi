# -*- coding: utf-8 -*-
from flask import Blueprint, jsonify, redirect, request, session
import logging
from pymongo import MongoClient
from datetime import datetime
import os
import re
from uuid import uuid4
import sendgrid

from tools.Tools import DbManager

logger = logging.getLogger(__name__)

u"""
**************************************************
ui layer
"""

users_page = Blueprint('users_page', __name__,
                       template_folder='templates', static_folder='static')


@users_page.route('/apiv1.0/users', methods=['GET'])
def getusers():
    u"""
    return the complete list of user without filter neither sort
    :return: collection of users in jso format
    """
    mgr = UserManager()
    users = mgr.getAllUsers()
    logger.info("getusers::users={}".format(users))
    return jsonify({'users': users})


@users_page.route('/apiv1.0/users/<user_id>', methods=['GET', 'POST'])
def getuser(user_id):
    u"""
    main route for user
    :param user_id: uuid
    :return: user in json format
    """
    logger.info("API USER:: user_id={} / method={}".format(user_id, request.method))
    logger.info(u"saveuser::user_id:{} / json param:{}".format(user_id, request.json))
    mgr = UserManager()
    user = mgr.getUserByUserId(user_id)
    if request.method == 'POST':
        userFromClient = request.json["user"]
        #call Service (DAO)
        logger.info(u'saveuser::user={}'.format(user))
        checkRight=False
        if user.pwd=="" or user.pwd is None:
            checkRight=True
        else:
            if "cookieUserKey" in session:
                cookieUserKey = session['cookieUserKey']
                logger.info(u"getuser::cookieUserKey={}".format(cookieUserKey))
                if (user.user_id==cookieUserKey):
                    checkRight=True
        if (checkRight):
            mgr.saveUser(user.email, userFromClient["nickName"],
                         userFromClient["description"], user.user_id, user.validated,
                         userFromClient["pwd"])

            return jsonify({'user': request.json["user"]})
        else:
            return "Ha ha ha ! Mais t'es pas la bonne personne pour faire ça, mon loulou", 403
    else:
        #= GET
        logger.info("getuser::uuid={}=user={}".format(user_id, user))
        return jsonify({'user': user.__dict__})


@users_page.route('/subscription', methods=['POST'])
def subscriptionPost():
    u"""
    first step of subscription : store user in db  and email send (before user validation)
    :return: forward to a page (not angular style : TODO change it if necessary)
    """
    logger.info("subscriptionPost")
    email = request.form['email']

    mgr = UserManager()
    user = mgr.getUserByEmail(email)
    if user is None:
        sg = sendgrid.SendGridClient("bbougeon138",
                    "s8drhcp01")

        message = sendgrid.Mail()

        message.add_to(email)

        message.add_to("eurommxvi.foot@gmail.com")
        message.set_from("eurommxvi.foot@gmail.com")
        message.set_subject("euroxxxvi - subscription")

        uuid = str(uuid4())
        logger.info(u"subscriptionPost::user_id:{}".format(uuid))
        mgr.saveUser(email, "", "", uuid, False, "")
        logger.info(u"\tsubscriptionPost::save done")
        urlcallback=u"http://euroxxxvi-typhontonus.rhcloud.com/users/{}/confirmation".format(uuid)
        message.set_html("<html><head></head><body><h1>MERCI DE</h1><h1><a href='{}'>Confirmer votre inscription</a></h1></hr></body></html>".format(urlcallback))

        sg.send(message)
        return redirect(u"/#logon_successfull")
    else:
        return redirect(u"/")


@users_page.route('/<user_id>/confirmation', methods=['GET'])
def confirmationSubscription(user_id):
    u"""
    url called from email to confirm subscription
    :return: redirect to user detail page (normal not return json data as angular style because user
    is in its email client and not in our site)
    """
    logger.info("confirmationSubscription")
    logger.info(u"confirmationSubscription::user_id:{} ".format(user_id))
    sg = sendgrid.SendGridClient("bbougeon138",
                "s8drhcp01")

    message = sendgrid.Mail()
    mgr = UserManager()
    user = mgr.getUserByUserId(user_id)
    logger.info(u'confirmationSubscription::user={}'.format(user))

    mgr.saveUser(user.email, "", "", user.user_id, True, "")

    message.add_to(user.email)

    message.add_to("eurommxvi.foot@gmail.com")
    message.set_from("eurommxvi.foot@gmail.com")
    message.set_subject("euroxxxvi - confirmation")
    message.set_html("<html><head></head><body><h1>Félicitations pour votre inscription ! </a></h1></hr></body></html>")

    sg.send(message)

    return redirect("/#user_detail/{}".format(user_id))

@users_page.route('/apiv1.0/login', methods=['POST'])
def login():
    logger.info("API LOGIN:: param={}/ method={}".format(request.json, request.method))
    connect = request.json["connect"]
    mgr = UserManager()
    user = mgr.authenticate(connect["email"], connect["thepwd"])
    logger.info("auth user={}".format(user))
    if (user is None):
        return "not authenticated", 401
    else:
        session['cookieUserKey'] = user.user_id
        return jsonify({'user': user.__dict__}), 200


"""
users_page= remove cookieUserKey
"""
@users_page.route('/apiv1.0/logout', methods=['POST'])
def logout():
    logger.info(u"API LOGOUT::logout - remove ={}".format(session['cookieUserKey']))
    del session['cookieUserKey']
    return u"Goog bye", 200


u"""
**************************************************
Service layer
"""

class User:

    def __init__(self):
        self.description = u""
        self.email = u""
        self.nickName = u""
        self.user_id=u""
        self.validated = False
        self.pwd=u""


    def convertFromBson(self, elt):
        """
        convert a User object from mongo
        """
        if 'description' in elt.keys():
            self.description = elt['description']
        if 'email' in elt.keys():
            self.email = elt['email']
        if 'nickName' in elt.keys():
            self.nickName = elt['nickName']
        if 'user_id' in elt.keys():
            self.user_id = elt['user_id']
        if 'validated' in elt.keys():
            self.validated = elt['validated']
        if 'pwd' in elt.keys():
            self.pwd= elt['pwd']

    def convertIntoBson(self):
        """
        convert a User object into mongo Bson format
        """
        elt = dict()
        #elt['_id'] = self._id
        elt['description'] = self.description
        elt['email'] = self.email
        elt['nickName'] = self.nickName
        elt['user_id'] = self.user_id
        elt['validated'] = self.validated
        elt['pwd'] = self.pwd
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

    def saveUser(self, email, nickName, description, user_id, validated, pwd):
        """ save a user"""
        localdb = self.getDb()
        bsonUser = localdb.users.find_one({"user_id": user_id})
        logger.info(u'saveUser::{} trouve ? bsonProperty ={}'.format(user_id, bsonUser ))
        if (bsonUser is None):
            bsonUser =dict()
            bsonUser ["email"]=email
            bsonUser ["nickName"]=nickName
            if user_id is None:
                user_id=str(uuid4())
            bsonUser["user_id"]=user_id
            bsonUser["validated"]=validated
            bsonUser["pwd"]=pwd
            logger.info(u'\tkey None - to create : {}'.format(bsonUser))
            id = localdb.users.insert_one(bsonUser).inserted_id
            logger.info(u'\tid : {}'.format(id))
        else:
            logger.info(u'\t try update to bsonUser["_id" : {}] p={}'.format(bsonUser["_id"], pwd))
            localdb.users.update({"_id":bsonUser["_id"]},
                    {"$set":{"email":email, "nickName":nickName,
                             "description" : description, "user_id" : user_id,
                             "validated":validated, "pwd":pwd}}, upsert=True)


    def getUserByEmail(self, email):
        """ get one property by key"""
        localdb = self.getDb()
        logger.info(u'getUserByEmail::email={}'.format(email))

        usersColl = localdb.users
        bsonUser = usersColl.find_one({"email": email})
        logger.info(u'getUserByEmail::bsonUser={}'.format(bsonUser))
        if bsonUser is not None:
            user = User()
            user.convertFromBson(bsonUser)
            return user
        else:
            return None

    def getUserByUserId(self, user_id):
        """ get one property by key"""
        localdb = self.getDb()
        logger.info(u'getUserByUserId::user_id={}'.format(user_id))

        usersColl = localdb.users
        bsonUser = usersColl.find_one({"user_id": user_id})
        logger.info(u'getUserByUserId::bsonUser={}'.format(bsonUser))
        if bsonUser is not None:
            user = User()
            user.convertFromBson(bsonUser)
            logger.info(u'\tgetUserByUserId::res={}'.format(user))
            return user
        else:
            return None

    def authenticate(self, email, pwd):
        """ authenticate user and retrieve it if ok"""
        localdb = self.getDb()
        logger.info(u'authenticate::email={}/pwd={}'.format(email, pwd))

        usersColl = localdb.users
        bsonUser = usersColl.find_one({"email": email})
        logger.info(u'authenticate::bsonUser={}'.format(bsonUser))
        if bsonUser is not None:
            user = User()
            user.convertFromBson(bsonUser)
            logger.info(u'authenticate::user.pwd={}'.format(user.pwd))
            if (pwd == user.pwd):
                logger.info(u'authenticated::user={}'.format(user))
                return user
            else:
                return None
        else:
            return None

