# -*- coding: utf-8 -*-
from flask import Blueprint, jsonify, redirect, request
import logging
from pymongo import MongoClient
from datetime import datetime
import os
import re
from uuid import uuid4
import sendgrid

from tools.Tools import DbManager

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
    coms=mgr.delete(com_id)
    return jsonify({'communities': coms})

@communities_page.route('/apiv1.0/communities', methods=['POST'])
def createCommunity():
    logger.info(u"savecommunity::json param:{} ".format(request.json))
    communityToCreateJSON = request.json["communityToCreate"]

    communityToCreate=Community()
    communityToCreate.title=communityToCreateJSON['title'];
    if 'description' in communityToCreateJSON:
        communityToCreate.description=communityToCreateJSON['description'];

    #call Service (DAO)
    mgr = CommunityManager()
    communityCreated = mgr.saveCommunity(communityToCreate)

    return jsonify({'community': communityCreated})

@communities_page.route('/apiv1.0/communities', methods=['PATCH'])
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
    communityUpdated = mgr.updateCommunity(communityToUpdate)

    return jsonify({'community': communityUpdated})

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
    admins : liste des id des communityId des administrateurs
    """""

    def __init__(self):
        self.description = u""
        self.title = u""
        self.com_id=u""
        self.admins = list()


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
        if 'admins' in elt.keys():
            adms=list()
            for uson in elt['admins']:
                u=User()
                adms.append(u.convertFromBson(uson))
                self.admins=adms

    def convertIntoBson(self):
        """
        convert a community object into mongo Bson format
        """
        elt = dict()
        #elt['_id'] = self._id
        elt['description'] = self.description
        elt['title'] = self.title
        elt['com_id'] = self.com_id
        adms=list()
        for u in self.admins:
            adms.append(u.convertIntoBson())
        elt['admins'] = adms
        return elt


class CommunityManager(DbManager):

    def getAllCommunities(self):
        """ get the complete list of properties"""
        localdb = self.getDb()
        logger.info(u'getAllCommunities::db={}'.format(localdb))

        communitysColl = localdb.communities
        communitiesList = communitysColl.find()
        logger.info(u'getAllCommunities::communitysList={}'.format(communitiesList))
        #Faut-il changer de list ou retourner le bson directement ?
        result = list()

        for communitybson in communitiesList:
            logger.info(u'\tgetAllCommunities::communitybson={}'.format(communitybson))
            community = Community()
            community.convertFromBson(communitybson)
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

    def delete(self, com_id):
        """ delete com """
        localdb = self.getDb()
        com = CommunityManager.getCommunityByCommunityId(self,com_id)
        logger.info(u'CommunityManager::delete={}'.format(com.com_id))
        bsonCom = localdb.communities.delete_one({"com_id": com.com_id})
        return CommunityManager.getAllCommunities(self)
