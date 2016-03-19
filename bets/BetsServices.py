# -*- coding: utf-8 -*-
from flask import Blueprint, jsonify
import logging
import types
from tools.Tools import DbManager
from users.UserServices import UserManager

logger = logging.getLogger(__name__)

bets_page = Blueprint('bets_page', __name__,
                       template_folder='templates', static_folder='static')


@bets_page.route('/betslist', methods=['GET'])
def bets():
    return bets_page.send_static_file('bets.html')






class Bet:
    u""""
    object_id (soit uuid soit objectid mongo)
    user_id (=uuid)
    com_id (uuid)
    key_match : "GROUPEE_SWE_BEL"
    category (GROUPE, 1_4, 1_2, 1_1, 1)
    categoryName (groupeA, Quart 01, Demi 02...)
    dateDeadLineBet :  date limite de saisi du pari
    dateMatch : date match pour info
    libteamA: nom equipe A
    libteamB: nom équipe B
    teamA : code Equipe A
    teamB : code Equipe A
    resultA : pari resutat teamA
    resultB : pari resutat teamB
    db.bets.insert({"com_id": "qqq", "user_id":"zoo", "key_match" : "GROUPEE_SWE_BEL", "category":"GROUPE", "categoryName": "groupeA", "dateDeadLineBet" : "2016-03-18T20:21:37.330Z", "dateMatch" : "2016-03-18T20:21:37.330Z", "libteamA": "nom equipe A", "libteamB": "nom équipe B", "teamA" : "code Equipe A", "teamB" : "code Equipe A", "resultA" : "0", "resultB" : "0"});
    """""
    def __init__(self):
        self.object_id = u""
        self.user_id= u""
        self.com_id = u""
        self.key_match = u""
        self.resultA=-1
        self.resultB=-1
        self.category = u""
        self.categoryName= u""
        self.libteamA = u""
        self.libteamB = u""
        self.teamA = u""
        self.teamB = u""


    def convertFromBson(self, elt):
        """
        convert a community object from mongo
        """
        for k in elt.keys():
            self.__dict__[k]=k


    def convertIntoBson(self):
        """
        convert a community object into mongo Bson format
        """
        elt = dict()
        for k in self.__dict__ :
            elt[k]=self.__dict__[k]
        return elt

class BetsManager(DbManager):

    def getBets(self, user_id, com_id):
        """ get the complete list of posts"""
        localdb = self.getDb()
        logger.info(u'getBets::db={}'.format(localdb))

        bets = list()
        bets.append(dict([('category', "GROUPE"), ('categoryName', "GROUPEA"),("description", u"GROUPEA_FRA_ROU"),
                          ('key', u"GROUPEA_FRA_ROU"), ('libteamA', "FRANCE"), ("libteamB", "ROUMANIE"),
                          ("resultA", 0),("resultB", 0),( "teamA", "FRA"),( "teamB", "ROU"),
                          ("dateDeadLineBet" , "2016-03-18T12:00Z"),( "dateMatch" , "2016-06-18T18:45Z")]))
        bets.append(dict([('category', "GROUPE"), ('categoryName', "GROUPEA"),("description", u"GROUPEA_ALB_SWI"),
                          ('key', u"GROUPEA_ALB_SWI"), ('libteamA', "ALBANIE"), ("libteamB", "SUISSE"),
                          ("resultA", 0),("resultB", 0),( "teamA", "FRA"),( "teamB", "ROU"),
                          ("dateDeadLineBet" , "2016-03-18T12:00Z"),( "dateMatch" , "2016-03-18T15:00Z")]))

        return bets

        # betsColl = localdb.bets
        # betsList = betsColl.find({ "user_id": user_id, "com_id": com_id } ).sort([("date",-1)]).limit(30)
        # logger.info(u'getBets::betsList={}'.format(betsList))
        # #Faut-il changer de list ou retourner le bson directement ?
        # result = list()
        #
        # for betbson in betsList:
        #
        #     logger.info(u'\tgetBetsOfUser::betbson={}'.format(betbson))
        #     bet = Bet()
        #     bet.convertFromBson(betbson)
        #
        #     userMgr = UserManager()
        #     user = userMgr.getUserByUserId(bet.user_id)
        #
        #     logger.info(u'\tgetAllPosts::post={}'.format(bet))
        #     tmpdict = bet.__dict__
        #     logger.info(u'\tgetAllPosts::tmpdict={}'.format(tmpdict))
        #     result.append(tmpdict)
        # return result


