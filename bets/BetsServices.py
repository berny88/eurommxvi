# -*- coding: utf-8 -*-
from flask import Blueprint, jsonify
import logging
import types

logger = logging.getLogger(__name__)

bets_page = Blueprint('bets_page', __name__,
                       template_folder='templates', static_folder='static')


@bets_page.route('/betslist', methods=['GET'])
def bets():
    return bets_page.send_static_file('bets.html')


@bets_page.route('/apiv1.0/bets', methods=['GET'])
def getBets():
    bets = list()
    bets.append(dict([('id', 1), ('com', 1),('teamA', u"FRA"), ('teamB', u"ENG"), ('betA', 1), ('betB', 0)]))
    bets.append(dict([('id', 2), ('com', 2),('teamA', u"ALL"), ('teamB', u"BEL"), ('betA', 10), ('betB', 0)]))

    logger.info(u" ------------ ")
    logger.info(u"type={}".format(type(bets)))
    logger.info(u"bets={}".format(bets))
    return jsonify({'bets': bets})




class Bet:
    u""""
    object_id
    user_id (=uuid)
    com_id (uuid)
    key_match : "GROUPEE_SWE_BEL"
    resultA : 0
    resultB : 0
    """""
    def __init__(self):
        self.object_id = u""
        self.user_id= u""
        self.com_id = u""
        self.key_match = u""
        self.resultA=-1
        self.resultB=-1


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
