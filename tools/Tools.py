# -*- coding: utf-8 -*-
from datetime import datetime
import logging
import os
import re
from flask import Blueprint, request, render_template, redirect, url_for
from pymongo import MongoClient


logger = logging.getLogger(__name__)
tools_page = Blueprint('tools_page', __name__,
                        template_folder='templates')


class ToolManager:
    """
    Load all match from json file
    """
    def __init__(self):
        self.DATE_FORMAT = '%Y-%m-%dT%H:%M:%S UTC'
        client = MongoClient(os.environ['OPENSHIFT_MONGODB_DB_URL'])
        logger.info(u'conn={}'.format(os.environ['OPENSHIFT_MONGODB_DB_URL']))
        self.db = client.euroxxxvi
        logger.info(u'db={}'.format(self.db))

    def datetime_parser(self, dct):
        for k, v in dct.items():
            if isinstance(v, str) and re.search("\ UTC", v):
                #print(u"k={}/v={}".format(k,v))
                #try:
                dct[k] = datetime.strptime(v, self.DATE_FORMAT)
                #except:
                #print("exception={}".format(sys.exc_info()[0]))
    #                pass
        return dct

    def my_json_encoder(self, obj):
        """Default JSON serializer."""
        logger.info(obj)
        if isinstance(obj, datetime):
            return obj.strftime(self.DATE_FORMAT)
        return obj

    def getDb(self):
        """ get Mongo DB access """
        if (self.db is None):
            client = MongoClient(os.environ['OPENSHIFT_MONGODB_DB_URL'])
            logger.info(u'getDb::conn={}'.format(os.environ['OPENSHIFT_MONGODB_DB_URL']))
            self.db = client.euroxxxvi
            logger.info(u'getDb::db={}'.format(self.db))

        return self.db


    def getProperties(self):
        """ get the complete list of properties"""
        localdb = self.getDb()
        logger.info(u'getProperties::db={}'.format(localdb))

        propertiesColl = localdb.properties
        propertiesList = propertiesColl.find()
        logger.info(u'propertiesList={}'.format(propertiesList))
        result = list()
        for prop in propertiesList:
            logger.info(u'\tprop={}'.format(prop))
            result.append(prop)
        return result

    def saveProperty(self, key, value):
        """ save a property"""
        localdb = self.getDb()
        logger.info(u'saveProperties::db={}'.format(localdb))

        propertiesColl = localdb.properties
        bsonProperty = propertiesColl.find_one({"key": key})
        logger.info(u'saveProperties::bsonProperty ={}'.format(bsonProperty ))
        if (bsonProperty is None):
            bsonProperty =dict()
            bsonProperty ["key"]=key
            bsonProperty ["value"]=value
            logger.info(u'\tkey None - to create : {}'.format(bsonProperty))
            id = self.getDb().properties.insert_one(bsonProperty).inserted_id
            logger.info(u'\tid : {}'.format(id))

        else:
            propertiesColl.update({"_id":bsonProperty["_id"]},
                {"$set":{"key":key, "value":value}}, upsert=True)
        logger.info(u'saveProperty={}'.format(bsonProperty))

    def getProperty(self, key):
        """ get one property by key"""
        localdb = self.getDb()
        logger.info(u'getProperties::db={}'.format(localdb))

        propertiesColl = localdb.properties
        bsonProperty = propertiesColl.find_one({"key": key})
        return bsonProperty

@tools_page.route('/properties/', methods=['GET'])
def properties():
    """
    """
    logger.info("properties::request:{} / {}".format(request.args, request.method))
    manager = ToolManager()
    propertyList = manager.getProperties()
    logger.info("properties::propertyList={}".format(propertyList ))
    #Add ever a new property to display a field
    prop = dict()
    prop[u"key"]=u"new.key"
    prop[u"value"]=u""
    propertyList.append(prop)

    return render_template('properties.html',
        propertyList=propertyList)

@tools_page.route('/saveproperties/', methods=['POST'])
def saveproperties():
    """
    """
    logger.info("saveproperties::request:{} / {}".format(request.args, request.method))
    logger.info("\tsaveproperties::request.values:{}".format(request.values))
    propDict=dict()
    for key, value in request.values.items():
        logger.info("saveproperties::key=[{}] / value=[{}]".format(key, value))
        if (key != "submit"):
            #the value contains the key as prefix.
            # example : key001_key=key001 or key001_value=theValue
            # for new key :
            # example : new.key_key=ponpon or new.key_value=theNewValue
            # we analyze only key=xxx_value
            if (key.split("_")[1] == u"value"):
                #extract keyCode
                keyCode = key.split("_")[0]
                #case of new key/value
                if (u"new.key_value" == key):
                    keyCode = request.values.get(u"new.key_key")

                logger.info("saveproperties::keyCode=[{}] ".format(keyCode))
                if keyCode in propDict:
                    prop = propDict[keyCode]
                    prop[u"value"] = value
                    logger.info("saveproperties::keyCode in propDict=[{}] ".format(prop))
                else:
                    prop = dict()
                    prop[u"key"] = keyCode
                    prop[u"value"] = value
                    propDict[keyCode]=prop
                    logger.info("saveproperties::keyCode not in propDict=[{}] ".format(prop))
                logger.info("saveproperties::propDict=[{}] ".format(propDict))

    for keyProp in propDict:
        prop = propDict[keyProp]
        logger.info("saveproperties:: final list: prop=[{}]".format(prop))
        manager = ToolManager()
        manager.saveProperty(prop[u"key"], prop[u"value"])

    return redirect(url_for('tools_page.properties'))
