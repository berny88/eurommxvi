# eurommxvi
clone of Openshift repo

Basicaly, this website is to manage bets for the Euro 2016 championship.

But the actual goal is to **learn** how to developp with **Python** and **AngularJS** in **Cloud** environment.
This website is based on the amazing simple Flask framework and on mongoDB to store persistant data.

Organisation
===
static
--
AngularJS entry point to display the single page application.

users
--
Package which manages CRUD user and authentication services.

communities
--
Package which manages CRUD service for Community and very simple *Blog* services.

matchs
--
Package which manages repository matchs (= the list of all match of the championshift)

bets
--
Package which manages the bet of users in all communities.

chat
--
User can write messages on a wall to push somes opinions.

stats
--
A good bet web site must display many view about bets and rankings.
This package groups services to request in DB to show many view on statistics.


to be continued

