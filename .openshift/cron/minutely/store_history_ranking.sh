#!/bin/bash


# Compét. finie, on commente les lignes ci-dessous

# 18h00 en heure du serveur = minuit en France
#if [ `date +%H:%M` == "18:00" ]
#then
#    date >> ${OPENSHIFT_LOG_DIR}/store_history_ranking.log 2>&1
#    cd ${OPENSHIFT_REPO_DIR}
#    python stats/store_history_ranking.py >> ${OPENSHIFT_LOG_DIR}/store_history_ranking.log 2>&1
#fi