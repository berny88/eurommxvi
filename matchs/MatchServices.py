# -*- coding: utf-8 -*-
from flask import Blueprint, jsonify
import logging
from tools.Tools import DbManager


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
       "NomCategorie": "GROUPEE"
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
        self.NomCategory = u""


    def convertFromBson(self, elt):
        """
        convert a community object from mongo
        """
        if 'key' in elt.keys():
            self.description = elt['key']
        if 'teamA' in elt.keys():
            self.teamA = elt['teamA']
        if 'teamB' in elt.keys():
            self.teamB = elt['teamB']
        if 'libteamA' in elt.keys():
            self.libteamA = elt['libteamA']
        if 'libteamB' in elt.keys():
            self.libteamB = elt['libteamB']
        if 'resultA' in elt.keys():
            self.resultA = elt['resultA']
        if 'resultB' in elt.keys():
            self.resultB = elt['resultB']
        if 'category' in elt.keys():
            self.category = elt['category']
        if 'NomCategory' in elt.keys():
            self.NomCategory = elt['NomCategory']


    def convertIntoBson(self):
        """
        convert a community object into mongo Bson format
        """
        elt = dict()
        #elt['_id'] = self._id
        elt['key'] = self.key
        elt['teamA'] = self.teamA
        elt['teamB'] = self.teamB
        elt['libteamA'] = self.libteamA
        elt['libteamB'] = self.libteamB
        elt['resultA'] = self.resultA
        elt['resultB'] = self.resultB
        elt['category'] = self.category
        elt['NomCategory'] = self.NomCategory
        return elt


class MatchsManager(DbManager):

    def getAllMatchs(self):
        """ get the complete list of properties"""
        localdb = self.getDb()
        logger.info(u'getAllMatchs::db={}'.format(localdb))

        matchsColl = localdb.matchs
        matchsList = matchsColl.find().sort("title")
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







