# -*- coding: utf-8 -*-
from flask import Blueprint, jsonify
import logging


logger = logging.getLogger(__name__)

communities_page = Blueprint('communities_page', __name__,
                        template_folder='templates', static_folder='static')

coms = [
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
    return (u"[\n"
            u"    {\n"
            u"        'id': 1,\n"
            u"        'title': 'Buy groceries',\n"
            u"        'description': Milk, Cheese, Pizza, Fruit, Tylenol',\n"
            u"        'done': False\n"
            u"    },\n"
            u"    {\n"
            u"        'id': 2,\n"
            u"        'title': 'Learn Python',\n"
            u"        'description': 'Need to find a good Python tutorial on the web',\n"
            u"        'done': False\n"
            u"    }\n"
            u"    ]"), 200

#return jsonify({'communities': coms})


@communities_page.route('/apiv1.0/tasks', methods=['GET'])
def get_tasks():
    return jsonify({'communities': tasks})
