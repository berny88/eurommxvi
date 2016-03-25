# -*- coding: utf-8 -*-
from flask import Blueprint, jsonify, request, session
import logging
from uuid import uuid4
from bets.BetsServices import BetsManager
from communities.BlogsServices import BlogsManager, Blog

from tools.Tools import DbManager, BetProjectClass

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
    logger.info(u"createCommunity::json param:{} ".format(request.json))
    communityToCreateJSON = request.json["communityToCreate"]

    communityToCreate=Community()
    communityToCreate.title=communityToCreateJSON['title'];
    if 'description' in communityToCreateJSON:
        communityToCreate.description=communityToCreateJSON['description'];
    communityToCreate.admin_user_id=communityToCreateJSON['admin_user_id'];

    #call Service (DAO)
    mgr = CommunityManager()
    communityCreated = mgr.createCommunity(communityToCreate)

    return jsonify({'community': communityCreated.__dict__})

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
        return jsonify({'community': communityUpdated.__dict__})
    else:
        return "Ha ha ha ! Mais t'es pas la bonne personne pour faire ça, mon loulou", 403


@communities_page.route('/apiv1.0/communities/<com_id>/users/<user_id>/bets', methods=['GET'])
def getBets(com_id, user_id):
    u"""
    return the list of all bets of a user in a community.
    If user has never bet, we return the list of Matchs.
    :param com_id: id of community (uuid)
    :param user_id: id of user (uuid)
    :return:  a json form for the list of bet
    """
    betsMgr = BetsManager()
    bets = betsMgr.getBetsOfUserAndCom(user_id, com_id)

    logger.debug(u" ------------ ")
    logger.debug(u"bets={}".format(bets))
    return jsonify({'bets': bets})

@communities_page.route('/apiv1.0/communities/<com_id>/users/<user_id>/bets', methods=['PUT'])
def createOrUpdateBets(com_id, user_id):
    u"""
    save the list of bets of a user in a community.
    the list of bets is defined inrequest.json.
    :param com_id: id of community (uuid)
    :param user_id: id of user (uuid)
    :return the numbers of bets created or updated
    """
    betsMgr = BetsManager()
    logger.info(u"createOrUpdateBets::json param:{} ".format(request.json))
    betsJSON = request.json["bets"]

    checkRight=False
    if "cookieUserKey" in session:
        cookieUserKey = session['cookieUserKey']
        logger.info(u"getuser::cookieUserKey={}".format(cookieUserKey))
        if (user_id==cookieUserKey):
            checkRight=True
    if (checkRight):
        nbHit = betsMgr.createOrUpdateBets(user_id, com_id, betsJSON)
        return jsonify({'nbHit': nbHit})
    else:
        return "Ha ha ha ! Mais t'es pas la bonne personne pour faire ça, mon loulou", 403


@communities_page.route('/apiv1.0/communities/<com_id>/getplayersnumber', methods=['GET'])
def countPlayers(com_id):
    u"""
    :return la représentation json de { "data": { "playerCount": x}}
    :param com_id: id of community (uuid)
    :param user_id: id of user (uuid)
    """
    betsMgr = BetsManager()
    d= dict()
    playerCount = betsMgr.countPlayers(com_id)
    d["playerCount"]=playerCount
    return jsonify({'data': d})

@communities_page.route('/apiv1.0/communities/<com_id>/players', methods=['GET'])
def listOfPlayers(com_id):
    u"""
    :return la représentation json de { "data": { "playerCount": x}}
    :param com_id: id of community (uuid)
    :param user_id: id of user (uuid)
    """
    betsMgr = BetsManager()
    d= dict()
    players= betsMgr.players(com_id)
    d["players"]=players
    return jsonify({'data': d})

@communities_page.route('/apiv1.0/communities/<com_id>/blogs', methods=['GET'])
def blogs(com_id):
    u"""
    return the list of the blogs of the community
    :return json view of blogs
    :param com_id: id of community (uuid)
    """
    d= dict()
    mgr = BlogsManager()
    blogs = mgr.getBlogByCommunity(com_id)
    jsonList=list()
    for b in blogs:
        jsonList.append(b.convertIntoJson())
    d["blogs"]= jsonList
    return jsonify({'data': d})

@communities_page.route('/apiv1.0/communities/<com_id>/blogs', methods=['POST'])
def createBlogPost(com_id):
    u"""
    create a new blog in a community ; param sent in request.json
    :return status message
    :param com_id: id of community (uuid)
    """
    logger.info(u"createBlogPost::json param:{} ".format(request.json))
    mgr = BlogsManager()
    blog = Blog()
    blog.com_id=com_id
    blog.convertFromJson(request.json["blogpost"])
    mgr.createBlog(blog)
    return jsonify({'blog': blog.convertIntoJson()}), 200

@communities_page.route('/apiv1.0/communities/<com_id>/blogs/<blog_id>', methods=['DELETE'])
def deleteBlogPost(com_id, blog_id):
    u"""
    delete a blog post of community
    :return just a status message
    :param com_id: id of community (uuid)
    :param blog_id: id of the bog post (uuid)
    """
    logger.info(u"deleteBlogPost::json param:{} ".format(request.json))
    mgr = BlogsManager()
    blog = mgr.getBlogByCommunityAndBlogId(com_id, blog_id)
    if blog is not None:
        mgr.deleteBlog(blog)
        return jsonify({'msg': "Blog post deleted"}), 200
    else:
        return "hacking en cours", 500


u"""
**************************************************
Service layer
"""

class Community(BetProjectClass):

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
        return elt


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


    def createCommunity(self, com):
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
        com.com_id = com_id
        return com


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
        return com

    def deleteCommunity(self, com):
        """ delete com """
        localdb = self.getDb()
        bsonCom = localdb.communities.delete_one({"com_id": com.com_id})
        logger.info(u'CommunityManager::delete={}'.format(com.com_id))
        return CommunityManager.getAllCommunities(self)
