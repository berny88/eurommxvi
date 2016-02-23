# -*- coding: utf-8 -*-
from flask import Blueprint, jsonify
import logging


logger = logging.getLogger(__name__)

matchs_page = Blueprint('matchs_page', __name__,
                       template_folder='templates', static_folder='static')

matchs = [
    {
        'id': 1,
        'teamA': u'BEL',
        'teamB': u'NED',
        'matchDate': u'dd/mm/yyyy HH24:mi:ss'
    },
    {
        'id': 1,
        'teamA': u'FRA',
        'teamB': u'ENG',
        'matchDate': u'dd/mm/yyyy HH24:mi:ss'
    },
]


@matchs_page.route('/matchslist', methods=['GET'])
def matchslist():
    return matchs_page.send_static_file('matchs.html')


@matchs_page.route('/apiv1.0/matchs', methods=['GET'])
def getMatchs():
    return jsonify({'matchs': matchs})

