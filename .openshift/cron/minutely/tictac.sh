#!/bin/bash
date >> ${OPENSHIFT_LOG_DIR}/tictac.log
python pyt.py >> ${OPENSHIFT_LOG_DIR}/tictac.log