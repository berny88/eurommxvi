# -*- coding: utf-8 -*-
from flask import Blueprint, jsonify
import logging


logger = logging.getLogger(__name__)

matchs_page = Blueprint('matchs_page', __name__,
                       template_folder='templates', static_folder='static')

matchs = [
    {
        'id': 1,
        'nickName': u'PoumPoum',
        'email': u'poum@poum.chak',
        'description': u'poum poum chak poum pouum chak',
    },
    {
        'id': 2,
        'nickName': u'chakChak',
        'email': u'poum@poum.chak',
        'description': u'poum poum chak poum pouum chak',
    },
]


@matchs_page.route('/matchslist', methods=['GET'])
def matchslist():
    return matchs_page.send_static_file('matchs.html')


@matchs_page.route('/apiv1.0/matchs', methods=['GET'])
def getMatchs():
    return jsonify({'matchs': matchs})

