# -*- coding: utf-8 -*-
from flask import Blueprint, jsonify
import logging
import types

logger = logging.getLogger(__name__)

bets_page = Blueprint('bets_page', __name__,
                       template_folder='templates', static_folder='static')

bets = [
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


@bets_page.route('/betslist', methods=['GET'])
def bets():
    return bets_page.send_static_file('bets.html')


@bets_page.route('/apiv1.0/bets', methods=['GET'])
def getBets():
    logger.info(u" ------------ ")
    logger.info(u"type={}".format(type(bets)))
    logger.info(u"bets={}".format(bets))
    return jsonify({'bets': bets})

