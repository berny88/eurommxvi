# -*- coding: utf-8 -*-
from flask import Blueprint, jsonify
import logging


logger = logging.getLogger(__name__)

users_page = Blueprint('users_page', __name__,
                        template_folder='templates')

users = [
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


@users_page.route('/apiv1.0/users', methods=['GET'])
def getAllComunnities():
    return jsonify({'users': users})

@users_page.route('/signon', methods=['GET'])
def signon():
    return users_page.send_static_file('login.html')