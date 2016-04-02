#!/bin/bash
date >> ${OPENSHIFT_LOG_DIR}/tictac.log

source $OPENSHIFT_HOMEDIR/python/virtenv/venv/bin/activate
python ${OPENSHIFT_REPO_DIR}/cron_hourly.py >> ${OPENSHIFT_LOG_DIR}/tictac.log
