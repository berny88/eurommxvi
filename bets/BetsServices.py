# -*- coding: utf-8 -*-
from flask import Blueprint, jsonify
import logging


logger = logging.getLogger(__name__)

bets_page = Blueprint('bets_page', __name__,
                       template_folder='templates', static_folder='static')

bets = [
    {
        'id': 1,
        'nickName': u'PoumPoum',
        'email': u'poum@poum.chak',
        'description': u'poum poum chak poum pouum chak'
    },
    {
        'id': 2,
        'nickName': u'chakChak',
        'email': u'poum@poum.chak',
        'description': u'poum poum chak poum pouum chak'
    },
]


@bets_page.route('/betslist', methods=['GET'])
def bets():
    return bets_page.send_static_file('bets.html')


@bets_page.route('/apiv1.0/bets', methods=['GET'])
def getBets():
    return jsonify({'bets': bets})

