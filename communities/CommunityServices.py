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
        'description': u'poum poum chak poum pouum chak'
    },
    {
        'id': 2,
        'title': u'Second community',
        'description': u'polom polom polom'
    }
]

tasks = [
    {
        'id': 1,
        'title': u'Buy groceries',
        'description': u'Milk, Cheese, Pizza, Fruit, Tylenol',
        'done': False
    },
    {
        'id': 2,
        'title': u'Learn Python',
        'description': u'Need to find a good Python tutorial on the web',
        'done': False
    }
]


@communities_page.route('/communitieslist', methods=['GET'])
def communities():
    return communities_page.send_static_file('communities.html')

@communities_page.route('/apiv1.0/communities', methods=['GET'])
def getAllComunnities():
    return jsonify({'communities': communities})


@communities_page.route('/apiv1.0/tasks', methods=['GET'])
def get_tasks():
    return jsonify({'tasks': tasks})
