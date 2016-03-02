# -*- coding: utf-8 -*-
from flask import Blueprint, jsonify
import logging
from tools.Tools import DbManager


logger = logging.getLogger(__name__)

communities_page = Blueprint('communities_page', __name__,
                        template_folder='templates', static_folder='static')

coms = [
    {
        'id': 1,
        'title': u'FirstCommunities',
        'description': u"Berny's communities"
    },
    {
        'id': 2,
        'title': u'Static but from python',
        'description': u'yeahhhhh'
    },
    {
        'id': 3,
        'title': u'rayIsInTheHouse',
        'description': u'yahoooooo'
    }
]



@communities_page.route('/communitieslist', methods=['GET'])
def communities():
    return communities_page.send_static_file('communities.html')


@communities_page.route('/apiv1.0/communities', methods=['GET'])
def getAllComunnities():
    logger.info(">>{}".format(jsonify({'communities': coms}).data))
    return jsonify({'communities': coms})

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
            self.email = elt['title']
        if 'com_id' in elt.keys():
            self.nickName = elt['com_id']
        if 'admins' in elt.keys():
            self.community_id = elt['admins']

    def convertIntoBson(self):
        """
        convert a community object into mongo Bson format
        """
        elt = dict()
        #elt['_id'] = self._id
        elt['description'] = self.description
        elt['title'] = self.title
        elt['com_id'] = self.com_id
        elt['admins'] = self.admins
        return elt


class CommunityManager(DbManager):

    def getAllCommunities(self):
        """ get the complete list of properties"""
        localdb = self.getDb()
        logger.info(u'getAllCommunities::db={}'.format(localdb))

        communitysColl = localdb.communitiess
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


    def getCommunityBycommunityId(self, com_id):
        """ get one property by key"""
        localdb = self.getDb()
        logger.info(u'getcommunityBycommunityId::community_id={}'.format(com_id))

        communitysColl = localdb.communitys
        bsoncommunity = communitysColl.find_one({"com_id": com_id})
        logger.info(u'getcommunityBycommunityId::bsoncommunity={}'.format(bsoncommunity))
        if bsoncommunity is not None:
            community = Community()
            community.convertFromBson(bsoncommunity)
            logger.info(u'\tgetcommunityBycommunityId::res={}'.format(community))
            return community
        else:
            return None
