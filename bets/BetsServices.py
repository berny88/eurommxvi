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
    bets.append(dict([('id', 1), ('teamA', u"FRA"), ('teamB', u"ENG"), ('betA', 1), ('betB', 0)]))
    bets.append(dict([('id', 2), ('teamA', u"ALL"), ('teamB', u"BEL"), ('betA', 10), ('betB', 0)]))

    logger.info(u" ------------ ")
    logger.info(u"type={}".format(type(bets)))
    logger.info(u"bets={}".format(bets))
    return jsonify({'bets': bets})

