import unittest, os
from bets.BetsServices import Bet, BetsManager
from datetime import datetime, timezone

class TestBets(unittest.TestCase):

    def test_userconstructor(self):
        b = Bet()
        self.assertEqual(b.com_id, u"")
        self.assertEqual(b.user_id, u"")
        self.assertEqual(b.key, u"")
        self.assertIsNone(b.resultA)
        self.assertIsNone(b.resultB)
        self.assertIsNone(b._id)

    def test_bsonconversion(self):
        b = Bet()
        #"_id"



    def test_createOrUpdate(self):
        os.environ['OPENSHIFT_MONGODB_DB_URL']=u"mongodb://mmxvi:eurommxvi@127.0.0.1:27017/euroxxxvi"
        mgr = BetsManager()
        self.assertIsNotNone(mgr.getDb())
        bet = Bet()
        bet.resultA=1
        bet.resultB=10
        bet.user_id="moi_en_uuid"
        bet.com_id="ma_com_id_en_uuid"
        bet.category="categcode"
        bet.categoryName="categname"
        bet.key="keymatch"
        bet.libteamA="theliba"
        bet.libteamB="thelibb"
        bet.teamA="theteamA"
        bet.teamB="theteamb"
        bet.dateDeadLineBet=datetime(2016, 6, 2, 18, 15, 0, 0, tzinfo=timezone.utc)
        bet.dateMatch=datetime(2016, 6, 2, 18, 15, 0, 0, tzinfo=timezone.utc)

        mgr.createOrUpdate(bet)

        bets = mgr.getBetsOfUserAndCom(user_id="moi_en_uuid", com_id="ma_com_id_en_uuid")
        self.assertGreater(len(bets), 0)
        for u in bets:
            print(u)
        self.assertIsNotNone(bets)

        nb = mgr.delete(bet)
        self.assertEqual(1, nb)



    def test_createOrUpdateBets(self):
        os.environ['OPENSHIFT_MONGODB_DB_URL']=u"mongodb://mmxvi:eurommxvi@127.0.0.1:27017/euroxxxvi"
        mgr = BetsManager()
        self.assertIsNotNone(mgr.getDb())
        d = dict()
        d["resultA"]=1
        d["resultB"]=10
        d["user_id"]="moi_en_uuid"
        d["com_id"]="ma_com_id_en_uuid"
        d["category"]="categcode"
        d["categoryName"]="categname"
        d["key"]="keymatch"
        d["libteamA"]="theliba"
        d["libteamB"]="thelibb"
        d["teamA"]="theteamA"
        d["teamB"]="theteamb"
        d["dateDeadLineBet"]=datetime(2016, 6, 2, 18, 15, 0, 0, tzinfo=timezone.utc)
        d["dateMatch"]=datetime(2016, 6, 2, 18, 15, 0, 0, tzinfo=timezone.utc)

        blist = list()
        blist.append(d)

        res = mgr.createOrUpdateBets("baduserid", "badcomid", blist)
        self.assertEqual(0, res)

    def test_countPlayer(self):
        os.environ['OPENSHIFT_MONGODB_DB_URL']=u"mongodb://mmxvi:eurommxvi@127.0.0.1:27017/euroxxxvi"
        mgr = BetsManager()
        self.assertIsNotNone(mgr.getDb())
        bet = Bet()
        bet.resultA=1
        bet.resultB=10
        bet.user_id="moi_en_uuid"
        bet.com_id="ma_com_id_en_uuid"
        bet.category="categcode"
        bet.categoryName="categname"
        bet.key="keymatch"
        bet.libteamA="theliba"
        bet.libteamB="thelibb"
        bet.teamA="theteamA"
        bet.teamB="theteamb"
        bet.dateDeadLineBet=datetime(2016, 6, 2, 18, 15, 0, 0, tzinfo=timezone.utc)
        bet.dateMatch=datetime(2016, 6, 2, 18, 15, 0, 0, tzinfo=timezone.utc)

        mgr.createOrUpdate(bet)

        result = mgr.countPlayers("ma_com_id_en_uuid")
        self.assertEqual(1, result)
        players = mgr.players("ma_com_id_en_uuid")
        self.assertEqual(1, len(players))

        bet2 = Bet()
        bet2.resultA=1
        bet2.resultB=10
        bet2.user_id="moi_en_uuid"
        bet2.com_id="ma_com_id_en_uuid"
        bet2.category="categcode"
        bet2.categoryName="categname"
        bet2.key="keymatch"
        bet2.libteamA="theliba"
        bet2.libteamB="thelibb"
        bet2.teamA="theteamA"
        bet2.teamB="theteamb"
        bet2.dateDeadLineBet=datetime(2016, 6, 2, 18, 15, 0, 0, tzinfo=timezone.utc)
        bet2.dateMatch=datetime(2016, 6, 2, 18, 15, 0, 0, tzinfo=timezone.utc)
        mgr.createOrUpdate(bet)

        mgr.delete(bet)
        mgr.delete(bet2)


if __name__ == '__main__':
    unittest.main()
