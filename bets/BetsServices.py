# -*- coding: utf-8 -*-
import logging

from bson.objectid import ObjectId
from flask import Blueprint

from tools.Tools import DbManager
from datetime import datetime
from users.UserServices import UserManager, User

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
            if k == "_id":
                logger.info(u'convertIntoBson={} - do nothing'.format(self._id))
                #if not self._id is None:
                #    logger.info(u'convertIntoBson={}'.format(self._id))
                #    elt[k] = ObjectId(self._id)
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
            if key in betsDict:
                bet.convertFromBson(betsDict[key])
                logger.info(u'\tgetBetsOfUserAndCom::bet={}'.format(bet))
                tmpdict = bet.__dict__
                result.append(tmpdict)
            else:
                matchsDict[key].pop("_id", None)
                bet.convertFromBson(matchsDict[key])
                # force result to none if user has never bet
                bet._id = None
                bet.resultA = None
                bet.resultB = None
                logger.info(u'\tgetBetsOfUserAndCom::bet={}'.format(bet))
                tmpdict = bet.__dict__
                result.append(tmpdict)

        result.sort(key=lambda bet: bet["dateMatch"])

        return result

    def createOrUpdateBets(self, user_id, com_id, bets):
        u"""
        update a list af bet for user in a community
        :param user_id: id of user (to check with the detail of bet)
        :param com_id: id of community (to check with the detail of bet)
        :param bets: list of bets
        :return: nb of bets updated or created
        """
        nbHit = 0
        for b in bets:
            bet = Bet()
            bet.convertFromBson(b)
            currDate = datetime.utcnow()
            if bet.user_id==user_id and bet.com_id==com_id:
                logger.warn(u'\ttry save : {}\n'.format(b))
                self.createOrUpdate(bet)
                nbHit = nbHit + 1
            else:
                logger.warn(u'\thack en cours : {}\n'.format(b))
        return nbHit

    def createOrUpdate(self, bet):
        u"""
        store a bet (create is not exist or update)
        :param bet: the bet to create or update
        :return: the bet (i'm sure if it is good idea)
        """
        bsonBet = self.getDb().bets.find_one({"user_id": bet.user_id, "com_id": bet.com_id,
                                              "key": bet.key})
        if bsonBet is None:
            bsonBet = bet.convertIntoBson()
            bsonBet .pop("_id", None)
            logger.info(u'\t\tto create : {}'.format(bsonBet))
            newid = self.getDb().bets.insert_one(bsonBet).inserted_id
            logger.info(u'\t\tid : {}'.format(newid))
        else:
            logger.info(u'\t\t try update to bsonBet["_id" : {}] with bet={}'.format(bsonBet["_id"], bet))
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

    def countPlayers(self, com_id):
        u"""
        count of number of distinct user in a community
        :param com_id: the community id
        :return: the number of user who had bet
        """
        result = len(self.getDb().bets.distinct("user_id", {"com_id":com_id}))
        return result

    def players(self, com_id):
        u"""
        list of users of distinct user in a community
        :param com_id: the community id
        :return: the number of user who had bet
        """
        userIdList = self.getDb().bets.distinct("user_id", {"com_id":com_id})
        usermgr = UserManager()
        result=list()
        for uuid in userIdList:
            user = usermgr.getUserByUserId(uuid)
            result.append(user.__dict__)
        return result
