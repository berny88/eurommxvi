# -*- coding: utf-8 -*-

import logging
import os, sys
from flask import Flask
from flask import render_template

from communities.CommunityServices import communities_page
from users.UserServices import users_page
from bets.BetsServices import bets_page
from matchs.MatchServices import matchs_page
from tools.Tools import ToolManager, tools_page
# using SendGrid's Python Library - https://github.com/sendgrid/sendgrid-python
import sendgrid

#from datetime import date
#from flask import request, session, flash, redirect

"""
Main application
"""
app = Flask(__name__)
app.debug = True
# use env variable !!
app.secret_key = u'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT#BB'
app.register_blueprint(communities_page, url_prefix="/communities", template_folder='templates')
app.register_blueprint(users_page, url_prefix="/users", template_folder='templates')
app.register_blueprint(bets_page, url_prefix="/bets", template_folder='templates')
app.register_blueprint(matchs_page, url_prefix="/matchs", template_folder='templates')
app.register_blueprint(tools_page, url_prefix="/tools", template_folder='templates')

logging.basicConfig(format='%(asctime)s|%(levelname)s|%(name)s|%(message)s',\
    filename='{}/euroxxxvi.log'.format(os.environ['OPENSHIFT_LOG_DIR']), level=logging.INFO)
app.logger.info('Started')
ch = logging.StreamHandler(sys.stdout)
ch.setLevel(logging.DEBUG)

logger = logging.getLogger(__name__)
logger.addHandler(ch)



@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0, no-cache, no-store, must-revalidate'
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    #logger.info(u'response.headers={}'.format(response.headers))
    return response

@app.route('/')
def mainPage():
    """
    Main single page stored in static folder
    """
    return app.send_static_file('index.html')


@app.route('/test/')
def test():
    return app.send_static_file('test.html')


@app.route('/testmongo/')
def testmongo():
    tool = ToolManager()
    db = tool.getDb()
    logger.info(u'test mongo : db={}'.format(db))
    tmp = tool.getProperty(u"test")
    logger.info(u'test mongo : tmp={}'.format(tmp))
    tool.saveProperty(u"test", "firstProperties")
    props = tool.getProperties()
    logger.info(u'test mongo : {}'.format(props))

    return u"Test Mongo", 200



@app.route('/testmail/')
def testmail():
    sg = sendgrid.SendGridClient("bbougeon138",
                "s8drhcp01")

    message = sendgrid.Mail()

    message.add_to("eurommxvi.foot@gmail.com")
    message.set_from("eurommxvi.foot@gmail.com")
    message.set_subject("test from openshift")
    message.set_html("<html><head></head><body><h1>Il faut bien tapper : rhc env set SENDGRID_HOSTNAME=smtp.sendgrid.net -a euroxxxvi</h1></hr></body></html>")

    sg.send(message)

    return u"look at your email box", 200


@app.errorhandler(404)
def ma_page_404(error):
    return u"Page not found !<br/> <h1>404 error code !</h1> Where do you really want to go ?", 404

@app.route('/google3ccef6a94eda5129.html')
def google3ccef6a94eda5129():
    """
    google file to specify that the site is owned by me
    """
    return u'google-site-verification: google3ccef6a94eda5129.html'

"""
only to test : OPENSHIFT_LOG_DIR
"""
if __name__ == '__main__':
    app.run()
