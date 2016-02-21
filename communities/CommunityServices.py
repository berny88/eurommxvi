# -*- coding: utf-8 -*-
from flask import Blueprint, jsonify
import logging


logger = logging.getLogger(__name__)

communities_page = Blueprint('communities_page', __name__,
                        template_folder='templates', static_folder='static')

communities = [
    {
        'id': 1,
        'title': u'First community',
        'description': u'poum poum chak poum pouum chak',
        'admins': [
            {
                'userId' : u'superUser'
            }
        ]
    },
    {
        'id': 2,
        'title': u'Second community',
        'description': u'polom polom polom',
        'admins': [
            {
                'userId' : u'superUser'
            },
            {
                'userId' : u'actualSuperUser'
            }
        ]
    }
]

@communities_page.route('/communities', methods=['GET'])
def communities():
    return communities_page.send_static_file('communities.html')

@communities_page.route('/apiv1.0/communities', methods=['GET'])
def getAllComunnities():
    return jsonify({'communities': communities})