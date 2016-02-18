# -*- coding: utf-8 -*-

import logging
import os
from flask import Flask

"""
Main application
"""
app = Flask(__name__)
app.debug = True
app.secret_key = u'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT#BB'
logging.basicConfig(format='%(asctime)s|%(levelname)s|%(message)s',\
    filename='{}/euroxxxvi.log'.format(os.environ['OPENSHIFT_LOG_DIR']), level=logging.INFO)
app.logger.info('Started')
logger = logging.getLogger(__name__)

@app.route('/')
def mainPage():
    return u"Comming soon", 200


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
