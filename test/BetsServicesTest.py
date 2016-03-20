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
    #
    # def test_getsaveuser(self):
    #     os.environ['OPENSHIFT_MONGODB_DB_URL']=u"mongodb://mmxvi:eurommxvi@127.0.0.1:27017/euroxxxvi"
    #     mgr = UserManager()
    #
    #     usera = mgr.saveUser("email@test.fr", "", "", "uuidxxx", False)
    #
    #     user = mgr.getUserByEmail(u"email@test.fr")
    #
    #
    #     self.assertIsNotNone(user)
    #
    #     self.assertIsNotNone(user.email)
    #     self.assertIsNotNone(user.user_id)

if __name__ == '__main__':
    unittest.main()
