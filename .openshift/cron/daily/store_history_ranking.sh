#!/bin/bash
date >> ${OPENSHIFT_LOG_DIR}/store_history_ranking.log 2>&1

cd ${OPENSHIFT_REPO_DIR}

python stats/store_history_ranking.py >> ${OPENSHIFT_LOG_DIR}/store_history_ranking.log 2>&1