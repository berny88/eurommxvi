# -*- coding: utf-8 -*-
import logging

from bson.objectid import ObjectId
from flask import Blueprint

from tools.Tools import DbManager
from datetime import datetime

logger = logging.getLogger(__name__)

bets_page = Blueprint('bets_page', __name__,
                      template_folder='templates', static_folder='static')


@bets_page.route('/betslist', methods=['GET'])
def bets():
    return bets_page.send_static_file('bets.html')


class Bet:
    u""""
    _id (soit uuid soit objectid mongo)
    user_id (=uuid)
    com_id (uuid)
    key : "GROUPEE_SWE_BEL"
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
    nbpoints : score calculated after the end of the match
    "2016-06-22T19:00:00Z",
    "2016-03-18T20:45:16.692Z"
    db.bets.insert({"com_id": "qqq", "user_id":"zoo", "key_match" : "GROUPEE_SWE_BEL", "category":"GROUPE",
    "categoryName": "groupeA", "dateDeadLineBet" : "2016-03-18T20:21:37.330Z", "dateMatch" : "2016-03-18T20:21:37.330Z",
     "libteamA": "nom equipe A", "libteamB": "nom équipe B", "teamA" : "code Equipe A", "teamB" : "code Equipe A",
     "resultA" : "0", "resultB" : "0"});
    """""

    def __init__(self):
        self._id = None
        self.user_id = u""
        self.com_id = u""
        self.key = u""
        self.resultA = None
        self.resultB = None
        self.category = u""
        self.categoryName = u""
        self.libteamA = u""
        self.libteamB = u""
        self.teamA = u""
        self.teamB = u""
        self.nbpoints = 0

    def convertFromBson(self, elt):
        """
        convert a community object from mongo
        :param elt bson structure from mongodb
        """
        for k in elt.keys():
            if k == "_id":
                self._id = str(elt[k])
            else:
                self.__dict__[k] = elt[k]

    def convertIntoBson(self):
        """
        convert a community object into mongo Bson format
        """
        elt = dict()
        for k in self.__dict__:
            if k == "_id" and self._id is not None:
                elt[k] = ObjectId(self._id)
            else:
                elt[k] = self.__dict__[k]
        return elt


class BetsManager(DbManager):
    def getBetsOfUserAndCom(self, user_id, com_id):
        localdb = self.getDb()
        # get all matchs
        matchsList = localdb.matchs.find().sort("dateMatch")

        # search all bets for user and community
        betsList = localdb.bets.find({"user_id": user_id, "com_id": com_id})
        logger.info(u'getBets::betsList={}'.format(betsList))
        # Faut-il changer de list ou retourner le bson directement ?
        result = list()

        matchsDict = dict()
        for matchbson in matchsList:
            matchsDict[matchbson[u"key"]] = matchbson

        betsDict = dict()
        for betbson in betsList:
            betsDict[betbson[u"key"]] = betbson

        for key in matchsDict:
            logger.info(u'\tgetBetsOfUserAndCom::key={}'.format(key))
            bet = Bet()
            bet.user_id = user_id
            bet.com_id = com_id
            if key in betsList:
                bet.convertFromBson(betsDict[key])
                logger.info(u'\tgetBetsOfUserAndCom::bet={}'.format(bet))
                tmpdict = bet.__dict__
                result.append(tmpdict)
            else:
                bet.convertFromBson(matchsDict[key])
                # force result to none if user has never bet
                bet.resultA = None
                bet.resultB = None
                logger.info(u'\tgetBetsOfUserAndCom::bet={}'.format(bet))
                tmpdict = bet.__dict__
                result.append(tmpdict)

        result.sort(key=lambda bet: bet["dateMatch"])

        return result

    def createOrUpdateBets(self, user_id, com_id, bets):
        nbHit = 0
        for b in bets:
            bet = Bet()
            bet.convertFromBson(b)
            currDate = datetime.utcnow()
            if bet.user_id==user_id and bet.com_id==com_id and currDate<bet.dateDeadLineBet:
                logger.warn(u'\ttry save : {}'.format(b))
                self.createOrUpdate(b)
                nbHit = nbHit + 1
            else:
                logger.warn(u'\thack en cours : {}'.format(b))
        return nbHit

    def createOrUpdate(self, bet):
        bsonBet = self.getDb().bets.find_one({"user_id": bet.user_id, "com_id": bet.com_id,
                                              "key": bet.key})
        if bsonBet is None:
            bsonBet = bet.convertIntoBson()
            logger.info(u'\tto create : {}'.format(bsonBet))
            newid = self.getDb().bets.insert_one(bsonBet).inserted_id
            logger.info(u'\tid : {}'.format(newid))
        else:
            logger.info(u'\t try update to bsonBet["_id" : {}] with bet={}'.format(bsonBet["_id"], bet))
            self.getDb().users.update({"_id": bsonBet["_id"]},
                                      {"$set": {"com_id": bet.com_id, "user_id": bet.user_id,
                                                "key": bet.key, "category": bet.category,
                                                "categoryName": bet.categoryName,
                                                "dateDeadLineBet": bet.dateDeadLineBet,
                                                "dateMatch": bet.dateMatch, "libteamA": bet.libteamA,
                                                "libteamB": bet.libteamB,
                                                "teamA": bet.teamA, "teamB": bet.teamB,
                                                "resultA": bet.resultA, "resultB": bet.resultB}}, upsert=True)
        return bet

    def delete(self, bet):
        u"""
        search bet in db by com_id/user_id/key match
        :param bet: bet to remove
        :return: thenb of deletion
        """
        bsonBet = self.getDb().bets.find_one({"user_id": bet.user_id, "com_id": bet.com_id,
                                              "key": bet.key})
        result = self.getDb().bets.delete_one({"_id": bsonBet["_id"]})
        return result.deleted_count
