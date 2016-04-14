# -*- coding: utf-8 -*-
import logging

from flask import Blueprint, jsonify

from tools.Tools import DbManager

from bets.BetsServices import BetsManager

logger = logging.getLogger(__name__)

stats_page = Blueprint('stats_page', __name__,
                      template_folder='templates', static_folder='static')


@stats_page.route('/apiv1.0/stats/ranking', methods=['GET'])
def ranking():
    u"""
    :return la représentation json du classement général
    """
    betsMgr = BetsManager()
    d = dict()
    rankings = betsMgr.getRanking(None)
    d["rankings"]=rankings
    return jsonify({'data': d})

@stats_page.route('/apiv1.0/stats/teams', methods=['GET'])
def get_stats_teams():
    u"""
    expected outout
    {   "name": "teams",
        "children": [
            {   "name": "groupea",
                "color":"blue",
                "children": [
                    { "name": "FRANCE", "size": 12 },
                    { "name": "ROUMANIE", "size": 5 },
                    { "name": "ALBANIE", "size": 1 },
                    { "name": "SUISSE", "size": 8 }
                ]
            },
            {   "name": "data",
                "color":"red",
                "children": [
                    { "name": "PAYS DE GALLES", "size": 12 },
                    { "name": "ANGLETERRE", "size": 5 },
                    { "name": "RUSSIE", "size": 1 },
                    { "name": "SLOVAQUIE", "size": 8 }
                ]
            }
        ]
    }
    """
    mgr = StatsManager()
    d=dict()
    d["name"]=u"team"
    d["children"]=mgr.get_team_stats()
    return jsonify({'teams': d})

class StatTeamGoal:
    def __init__(self):
        self.key=u""
        self.name=u""
        self.group_name=u""
        self.nb_goal=0

class StatsManager(DbManager,object):


    def __init__(self):
        super(StatsManager, self).__init__()
        d=dict()
        d["GROUPEA"]=u"#4DD17B"
        d["GROUPEB"] = u"#A490D6"
        d["GROUPEC"] = u"#D9669A"
        d["GROUPED"] = u"#F24444"
        d["GROUPEE"] = u"#E86620"
        d["GROUPEF"] = u"#DAEB49"
        self.color=d

    def get_team_stats(self):
        u"""
        return the list of team with their number of goal, bet by all user.
        """
        localdb = self.getDb()
        result=list()
        # get all matchs
        matchsList = localdb.matchs.find().sort("dateMatch")

        # search all bets for all user and community
        betsList = localdb.bets.find()

        result = list()

        matchs_dict = dict()
        group_dict = dict()
        team_dict = dict()
        # populate StatTeamGoal (key=team)
        for matchbson in matchsList:
            matchs_dict[matchbson[u"key"]] = matchbson
            group_name = matchbson[u"key"].split("_")[0]
            if group_name not in group_dict:
                d = dict()
                d["color"] = self.color[group_name]
                d["name"] = group_name
                d["children"] = list()
                group_dict[group_name] = d
            if matchbson[u"teamA"] not in team_dict:
                stat=StatTeamGoal()
                stat.key=matchbson["teamA"]
                stat.name=matchbson["libteamA"]
                stat.group_name = group_name
                team_dict[matchbson["teamA"]]=stat

            if matchbson[u"teamB"] not in team_dict:
                stat=StatTeamGoal()
                stat.key=matchbson["teamB"]
                stat.name=matchbson["libteamB"]
                stat.group_name = group_name
                team_dict[matchbson["teamB"]]=stat

        list_team=list()
        #sum goal for each team (perhaps possible in mongo ???
        for betbson in betsList:
            if betbson["teamA"] in team_dict:
                stat = team_dict[betbson["teamA"]]
                stat.nb_goal=stat.nb_goal + self.get_result(betbson, "A")

            if betbson["teamB"] in team_dict:
                stat = team_dict[betbson["teamA"]]
                stat.nb_goal=stat.nb_goal + self.get_result(betbson, "B")

        for team_name in team_dict:
            stat = team_dict[team_name]
            group_dict[stat.group_name]["children"].append(stat.__dict__)

        for grp in group_dict:
            result.append(group_dict[grp])

        return result

    def get_result(self, dict_bson, type_team):
        if "result"+type_team in dict_bson:
            if dict_bson["result"+type_team] is not None:
                return int(dict_bson["result"+type_team])
            else:
                return 0

