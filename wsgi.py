#!/usr/bin/python
import os
import sys

virtenv = os.environ['OPENSHIFT_PYTHON_DIR'] + '/virtenv/'
virtualenv = os.path.join(virtenv, 'bin/activate_this.py')
docroot = os.environ['OPENSHIFT_REPO_DIR']
datadir = os.environ['OPENSHIFT_DATA_DIR']
try:
    # python 2 execfile(virtualenv, dict(__file__=virtualenv))
    # python 3
    exec(compile(open(virtualenv, "rb").read(), virtualenv, 'exec'), globals, locals)
except IOError:
    pass

#
# IMPORTANT: Put any additional includes below this line.  If placed above this
# line, it's possible required libraries won't be in your searchable path
#

print(" start euroXXXVI .....")
print(sys.path)
from flaskapp import app as application

#
# Below for testing only
#


# Below for testing only
#
if __name__ == '__main__':
    from wsgiref.simple_server import make_server

    httpd = make_server('localhost', 8051, application)
    # Wait for a single request, serve it and quit.
    # httpd.handle_request()
    httpd.serve_forever()
