# -*- coding: utf-8 -*-
from flask import Blueprint, jsonify
import logging


logger = logging.getLogger(__name__)

bets_page = Blueprint('bets_page', __name__,
                       template_folder='templates', static_folder='static')

bets = [
    dict(id=1, teamA=u'FRA', teamB=u'ENG', resA=1, resB=1),
    dict(id=2, teamA=u'ALL', teamB=u'BEL', resA=10, resB=1)
]


@bets_page.route('/betslist', methods=['GET'])
def bets():
    return bets_page.send_static_file('bets.html')


@bets_page.route('/apiv1.0/bets', methods=['GET'])
def getBets():
    logger.info(u" ------------ ")
    logger.info(u"bets={}".format(bets))
    return jsonify({'bets': bets})

