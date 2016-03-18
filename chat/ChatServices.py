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

from users.UserServices import UserManager

logger = logging.getLogger(__name__)

chat_page = Blueprint('chat_page', __name__,
                        template_folder='templates', static_folder='static')

@chat_page.route('/apiv1.0/posts', methods=['GET'])
def getAllPosts():
    mgr = ChatManager()
    posts=mgr.getAllPosts()
    logger.info(">>{}".format(jsonify({'posts': posts}).data))
    return jsonify({'posts': posts})



u"""
**************************************************
Service layer
"""

class Post:

    def __init__(self):
        self.message = u""
        self.date = u""
        self.post_id=u""
        self.post_user_id =u""


    def convertFromBson(self, elt):
        """
        convert a post object from mongo
        """
        if 'message' in elt.keys():
            self.message = elt['message']
        if 'date' in elt.keys():
            self.date = elt['date']
        if 'post_id' in elt.keys():
            self.post_id = elt['post_id']
        if 'post_user_id' in elt.keys():
            self.post_user_id = elt['post_user_id']

    def convertIntoBson(self):
        """
        convert a post object into mongo Bson format
        """
        elt = dict()
        #elt['_id'] = self._id
        elt['date'] = self.date
        elt['title'] = self.title
        elt['post_id'] = self.post_id
        elt['post_user_id'] = self.post_user_id


class ChatManager(DbManager):

    def getAllPosts(self):
        """ get the complete list of posts"""
        localdb = self.getDb()
        logger.info(u'getAllPosts::db={}'.format(localdb))

        postsColl = localdb.posts
        postsList = postsColl.find().sort("date")
        logger.info(u'getAllPosts::postsList={}'.format(postsList))
        #Faut-il changer de list ou retourner le bson directement ?
        result = list()

        for postbson in postsList:

            logger.info(u'\tgetAllPosts::postbson={}'.format(postbson))
            post = Post()
            post.convertFromBson(postbson)

            userMgr = UserManager()
            user = userMgr.getUserByUserId(post.post_user_id)
            if user is None:
                post.nickName = "Anonyme"
            else:
                post.nickName = user.nickName

            logger.info(u'\tgetAllPosts::post={}'.format(post))
            tmpdict = post.__dict__
            logger.info(u'\tgetAllPosts::tmpdict={}'.format(tmpdict))
            result.append(tmpdict)
        return result

