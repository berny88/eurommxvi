# -*- coding: utf-8 -*-
from flask import Blueprint, jsonify, request, session
import logging
from pymongo import MongoClient
from datetime import datetime
import os
import re
from uuid import uuid4
from bets.BetsServices import BetsManager
import sendgrid

from tools.Tools import DbManager, BetProjectClass

from users.UserServices import UserManager

logger = logging.getLogger(__name__)

u"""
**************************************************
Service layer
"""

class Blog(BetProjectClass):

    u""""
    communities = 'com_id': 1,
    title: u'First community',
    description: u'poum poum chak poum pouum chak',
    admins: [community]
    id : autoincrement par mongoDB ou  UUID
    title : texte libre mais unique max 50c
    description : texte libre
    admin_user_id : id de l'administrateur (=celui qui a créé la communauté)
    """""

    def __init__(self):
        self.blog_id=u""
        self.author = u""
        self.createdOn = u""
        self.title=u""
        self.com_id =u""
        self.comments=list()
        self.likes=0
        self.body = list()

    def convertFromJson(self, elt):
        """
        convert a blog object from mongo
        :param elt : dictionnary = json representation
        """
        for k in elt.keys():
            #we don't use _id attrb (from mongo)
            if k != "_id":
                if k =="comments":
                    for c in elt["comments"]:
                        comment=Comment()
                        comment.convertFromJson(c)
                        self.comments.append(comment)
                else:
                    self.__dict__[k] = elt[k]

    def __str__(self):
        return str(self.__dict__)

    def convertIntoJson(self):
        """
        convert a blog object into Json format
        """
        elt = dict()
        for k in self.__dict__:
            if k != "_id":
                elt[k] = self.__dict__[k]
            if k == "comments":
                l=list()
                for c in self.comments:
                    l.append(c.convertIntoJson())
                elt["comments"] = l
        return elt


class Comment(BetProjectClass):

    def __init__(self):
        self.author = u""
        self.createdOn = u""
        self.body= u""

    def convertFromJson(self, elt):
        """
        update current object (self) with blog object from mongo or ui layer (in JSON).
        we don't care od _id because comment is just a subcomponent of Blog
        :param elt : dictionnary = json representation
        """
        for k in elt.keys():
            self.__dict__[k] = elt[k]

    def convertIntoJson(self):
        """
        convert a blog object into Json format
        """
        elt = dict()
        for k in self.__dict__:
            elt[k] = self.__dict__[k]
        return elt


class BlogsManager(DbManager):

    def getBlogByCommunity(self, com_id):
        """ get the complete list of properties"""
        localdb = self.getDb()
        logger.info(u'getBlogByCommunity::db={}'.format(localdb))

        blogsColl = localdb.blogs
        blogsList = blogsColl.find({"com_id": com_id}).sort("createdOn")
        logger.info(u'getBlogByCommunity::communitysList={}'.format(blogsList))
        #Faut-il changer de list ou retourner le bson directement ?
        result = list()

        for blogbson in blogsList:
            logger.info(u'\tgetBlogByCommunity::blogbson={}'.format(blogbson))
            #tmpdict = blog.__dict__
            #logger.info(u'\tgetAllCommunities::tmpdict={}'.format(tmpdict))
            blog = Blog()
            blog.convertFromJson(blogbson)
            result.append(blog)
        return result


    def createBlog(self, blog):
        """ save com """
        localdb = self.getDb()
        blog.blog_id=str(uuid4())
        logger.info(u'\tTo create : {}'.format(blog.convertIntoJson()))
        id = localdb.blogs.insert_one(blog.convertIntoJson()).inserted_id
        logger.info(u'\tnew id : {}'.format(id))
        return blog

    def deleteBlog(self, blog):
        """ delete a blog"""
        localdb = self.getDb()

        logger.info(u'\tto delete : {}'.format(blog))
        result = localdb.blogs.delete_one({"blog_id":blog.blog_id})
        logger.info(u'\tnb deleted : {}'.format(result.deleted_count))
        return result.deleted_count