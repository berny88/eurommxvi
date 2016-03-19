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

communities_page = Blueprint('communities_page', __name__,
                        template_folder='templates', static_folder='static')

@communities_page.route('/apiv1.0/communities', methods=['GET'])
def getAllComunnities():
    mgr = CommunityManager()
    coms=mgr.getAllCommunities()
    logger.info(">>{}".format(jsonify({'communities': coms}).data))
    return jsonify({'communities': coms})

@communities_page.route('/apiv1.0/communities/<com_id>', methods=['GET'])
def getCommunity(com_id):
    mgr = CommunityManager()
    community = mgr.getCommunityByCommunityId(com_id)
    logger.info("getCommunity::uuid={}=community={}".format(com_id, community))
    return jsonify({'community': community.__dict__})

@communities_page.route('/apiv1.0/communities/<com_id>', methods=['DELETE'])
def deleteCommunity(com_id):
    mgr = CommunityManager()
    com = mgr.getCommunityByCommunityId(com_id)
    checkRight=False
    if "cookieUserKey" in session:
        cookieUserKey = session['cookieUserKey']
        logger.info(u"getuser::cookieUserKey={}".format(cookieUserKey))
        if (com.admin_user_id==cookieUserKey):
            checkRight=True
        userMgr = UserManager()
        userFromCookie = userMgr.getUserByUserId(cookieUserKey)
        if (userFromCookie.isAdmin):
            checkRight=True
    if (checkRight):
        coms=mgr.deleteCommunity(com)
        return jsonify({'communities': coms})
    else:
        return "Ha ha ha ! Mais t'es pas la bonne personne pour faire ça, mon loulou", 403

@communities_page.route('/apiv1.0/communities', methods=['POST'])
def createCommunity():
    logger.info(u"savecommunity::json param:{} ".format(request.json))
    communityToCreateJSON = request.json["communityToCreate"]

    communityToCreate=Community()
    communityToCreate.title=communityToCreateJSON['title'];
    if 'description' in communityToCreateJSON:
        communityToCreate.description=communityToCreateJSON['description'];
    communityToCreate.admin_user_id=communityToCreateJSON['admin_user_id'];

    #call Service (DAO)
    mgr = CommunityManager()
    communityCreated = mgr.saveCommunity(communityToCreate)

    return jsonify({'community': communityCreated})

@communities_page.route('/apiv1.0/communities', methods=['PUT'])
def updateCommunity():
    logger.info(u"updatecommunity::json param:{} ".format(request.json))
    communityToUpdateJSON = request.json["communityToUpdate"]

    communityToUpdate=Community()
    communityToUpdate.com_id=communityToUpdateJSON['com_id'];
    communityToUpdate.title=communityToUpdateJSON['title'];
    if 'description' in communityToUpdateJSON:
        communityToUpdate.description=communityToUpdateJSON['description'];

    #call Service (DAO)
    mgr = CommunityManager()
    com = mgr.getCommunityByCommunityId(communityToUpdate.com_id)
    checkRight=False
    if "cookieUserKey" in session:
        cookieUserKey = session['cookieUserKey']
        logger.info(u"getuser::cookieUserKey={}".format(cookieUserKey))
        if (com.admin_user_id==cookieUserKey):
            checkRight=True
        userMgr = UserManager()
        userFromCookie = userMgr.getUserByUserId(cookieUserKey)
        if (userFromCookie.isAdmin):
            checkRight=True
    if (checkRight):
        communityUpdated = mgr.updateCommunity(communityToUpdate)
        return jsonify({'community': communityUpdated})
    else:
        return "Ha ha ha ! Mais t'es pas la bonne personne pour faire ça, mon loulou", 403


@communities_page.route('/apiv1.0/<com_id>/users/<user_id>/bets', methods=['GET'])
def getBets(com_id, user_id):
    bets = list()
    bets.append(dict([('category', "GROUPE"), ('categoryName', "GROUPEA"),("description", u"GROUPEA_FRA_ROU"),
                      ('key', u"GROUPEA_FRA_ROU"), ('libteamA', "FRANCE"), ("libteamB", "ROUMANIE"),
                      ("resultA", 0),("resultB", 0),( "teamA", "FRA"),( "teamB", "ROU"),
                      ("dateDeadLineBet" , "2016-03-18T12:00Z"),( "dateMatch" , "2016-06-18T18:45Z")]))
    bets.append(dict([('category', "GROUPE"), ('categoryName', "GROUPEA"),("description", u"GROUPEA_ALB_SWI"),
                      ('key', u"GROUPEA_ALB_SWI"), ('libteamA', "ALBANIE"), ("libteamB", "SUISSE"),
                      ("resultA", 0),("resultB", 0),( "teamA", "FRA"),( "teamB", "ROU"),
                      ("dateDeadLineBet" , "2016-03-18T12:00Z"),( "dateMatch" , "2016-03-18T15:00Z")]))


    logger.info(u" ------------ ")
    logger.info(u"type={}".format(type(bets)))
    logger.info(u"bets={}".format(bets))
    return jsonify({'bets': bets})


u"""
**************************************************
Service layer
"""

class Community:

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
        self.description = u""
        self.title = u""
        self.com_id=u""
        self.admin_user_id =u""


    def convertFromBson(self, elt):
        """
        convert a community object from mongo
        """
        if 'description' in elt.keys():
            self.description = elt['description']
        if 'title' in elt.keys():
            self.title = elt['title']
        if 'com_id' in elt.keys():
            self.com_id = elt['com_id']
        if 'admin_user_id' in elt.keys():
            self.admin_user_id = elt['admin_user_id']

    def convertIntoBson(self):
        """
        convert a community object into mongo Bson format
        """
        elt = dict()
        #elt['_id'] = self._id
        elt['description'] = self.description
        elt['title'] = self.title
        elt['com_id'] = self.com_id
        elt['admin_user_id'] = self.admin_user_id


class CommunityManager(DbManager):

    def getAllCommunities(self):
        """ get the complete list of properties"""
        localdb = self.getDb()
        logger.info(u'getAllCommunities::db={}'.format(localdb))

        communitysColl = localdb.communities
        communitiesList = communitysColl.find().sort("title")
        logger.info(u'getAllCommunities::communitysList={}'.format(communitiesList))
        #Faut-il changer de list ou retourner le bson directement ?
        result = list()

        for communitybson in communitiesList:

            logger.info(u'\tgetAllCommunities::communitybson={}'.format(communitybson))
            community = Community()
            community.convertFromBson(communitybson)

            userMgr = UserManager()
            user = userMgr.getUserByUserId(community.admin_user_id)
            if user is None:
                community.admin_user_nickName = "Admin inconnu !"
            else:
                community.admin_user_nickName = user.nickName

            logger.info(u'\tgetAllCommunities::community={}'.format(community))
            tmpdict = community.__dict__
            logger.info(u'\tgetAllCommunities::tmpdict={}'.format(tmpdict))
            result.append(tmpdict)
        return result


    def getCommunityByCommunityId(self, com_id):
        """ get one property by key"""
        localdb = self.getDb()
        logger.info(u'getcommunityBycommunityId::community_id={}'.format(com_id))

        communitysColl = localdb.communities
        bsoncommunity = communitysColl.find_one({"com_id": com_id})
        logger.info(u'getcommunityBycommunityId::bsoncommunity={}'.format(bsoncommunity))
        if bsoncommunity is not None:
            community = Community()
            community.convertFromBson(bsoncommunity)

            userMgr = UserManager()
            user = userMgr.getUserByUserId(community.admin_user_id)
            if user is None:
                community.admin_user_nickName = "Admin inconnu !"
            else:
                community.admin_user_nickName = user.nickName

            logger.info(u'\tgetcommunityBycommunityId::res={}'.format(community))
            return community
        else:
            return None


    def saveCommunity(self, com):
        """ save com """
        localdb = self.getDb()

        bsonCom =dict()
        com_id=str(uuid4())
        bsonCom["com_id"]=com_id
        bsonCom["title"]=com.title
        bsonCom["description"]=com.description
        bsonCom["admin_user_id"]=com.admin_user_id

        logger.info(u'\tkey None - to create : {}'.format(bsonCom))
        id = localdb.communities.insert_one(bsonCom).inserted_id
        logger.info(u'\tid : {}'.format(id))
        return None


    def updateCommunity(self, com):
        """ update com """
        localdb = self.getDb()
        logger.info(u'CommunityManager::update={}'.format(com.com_id))
        bsonCom = localdb.communities.find_one({"com_id": com.com_id})
        logger.info(u'\tCommunityManager::update::{} trouve ? bsonProperty ={}'.format(com.com_id, bsonCom ))
        bsonCom2 =com.convertIntoBson()
        id = localdb.communities.update({"_id":bsonCom["_id"]},
                                       {"$set":{"title":com.title, "com_id":com.com_id,
                                                "description" : com.description}}, upsert=True)
        return None

    def deleteCommunity(self, com):
        """ delete com """
        localdb = self.getDb()
        bsonCom = localdb.communities.delete_one({"com_id": com.com_id})
        logger.info(u'CommunityManager::delete={}'.format(com.com_id))
        return CommunityManager.getAllCommunities(self)
