# -*- coding: utf-8 -*-
from flask import Blueprint, jsonify, request, session
from bson.objectid import ObjectId
import logging

from tools.Tools import DbManager
from users.UserServices import UserManager
from bets.BetsServices import BetsManager

logger = logging.getLogger(__name__)

matchs_page = Blueprint('matchs_page', __name__,
                       template_folder='templates', static_folder='static')



@matchs_page.route('/matchslist', methods=['GET'])
def matchslist():
    return matchs_page.send_static_file('matchs.html')


@matchs_page.route('/apiv1.0/matchs', methods=['GET'])
def getMatchs():
    mgr = MatchsManager()
    matchs=mgr.getAllMatchs()
    logger.info(">>{}".format(jsonify({'matchs': matchs}).data))

    return jsonify({'matchs': matchs})

@matchs_page.route('/apiv1.0/matchs', methods=['PUT'])
def updateMatchsResults():
    u"""
    save the result of matchs.
    only allowed to admin
    :return the numbers of matchs updated
    """
    logger.info("updateMatchsResults::{}".format(request.json["matchs"]))
    if "cookieUserKey" in session:
        mgr = MatchsManager()
        matchsjson = request.json["matchs"]
        cookieUserKey = session['cookieUserKey']
        user_mgr = UserManager()
        user = user_mgr.getUserByUserId(cookieUserKey)
        if user.isAdmin:
            logger.info(u"updateMatchsResults::update by ={}".format(user.email))
            mgr.update_all_matchs(matchsjson)
        else:
            return "Ha ha ha ! Mais t'es pas la bonne personne pour faire ça, mon loulou", 403
        nbHit=0
        return jsonify({'nbHit': nbHit})
    else:
        return "Ha ha ha ! Mais t'es qui pour faire ça, mon loulou ?", 403


u"""
**************************************************
Service layer
"""


class Match:
    u""""
     "key": "GROUPEE_SWE_BEL",
       "teamA": "SWE",
       "teamB": "BEL",
       "libteamA": "SUEDE",
       "libteamB": "BELGIQUE",
       "dateMatch": "22/06/2016 21:00:00",
       "dateDeadLineBet": "",
       "resultA": "",
       "resultB": "",
       "category": "GROUPE",
       "categoryName": "GROUPEE"
    """""
    def __init__(self):
        self.key = u""
        self.teamA = u""
        self.teamB = u""
        self.libteamA = u""
        self.libteamB = u""
        self.resultA=-1
        self.resultB=-1
        self.category = u""
        self.categoryName = u""


    def convertFromBson(self, elt):
        u"""
        convert a community object from mongo
        :param elt: bson data from mongodb
        :return: nothing
        """
        for k in elt.keys():
            if k == "_id":
                self._id = str(elt[k])
            else:
                self.__dict__[k] = elt[k]


    def convertIntoBson(self):
        u"""
        convert a community object into mongo Bson format
        :return: a dict to store in mongo as json
        """
        elt = dict()
        for k in self.__dict__:
            if k == "_id" and self._id is not None:
                elt[k] = ObjectId(self._id)
            else:
                elt[k] = self.__dict__[k]
        return elt


class MatchsManager(DbManager):

    def getAllMatchs(self):
        """
        get the complete list of matchs
        """
        localdb = self.getDb()
        logger.info(u'getAllMatchs::db={}'.format(localdb))

        matchsColl = localdb.matchs
        matchsList = matchsColl.find().sort("dateMatch")
        logger.info(u'getAllMatchs::matchsList={}'.format(matchsList))
        #Faut-il changer de list ou retourner le bson directement ?
        result = list()

        for matchbson in matchsList :
            logger.info(u'\tgetAllMatchs::matchsbson={}'.format(matchbson))
            match = Match()
            match.convertFromBson(matchbson)
            logger.info(u'\tgetAllMatchs::match={}'.format(match))
            tmpdict = match.__dict__
            logger.info(u'\tgetAllMatchs::tmpdict={}'.format(tmpdict))
            result.append(tmpdict)
        return result


    def update_all_matchs(self, matchs_to_update):
        #load all match from db (because we just want to update result
        matchs = self.getAllMatchs()
        for m in matchs:
            self.getDb()
            match_key=m["key"]
            #mettre à jour juste les resultats
            bet_mgr = BetsManager()
            # pour chaque match demander à betmanager de calculer le nb de points de chq bet
            # le principe sera de calculer le nbde pts d'un user = somme de ses paris


        return None






