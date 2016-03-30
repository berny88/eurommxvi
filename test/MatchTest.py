import unittest, os
from matchs.MatchServices import Match, MatchsManager
from bets.BetsServices import Bet, BetsManager

class MatchTest(unittest.TestCase):

    def test_exact_score(self):
        os.environ['OPENSHIFT_MONGODB_DB_URL'] = u"mongodb://mmxvi:eurommxvi@127.0.0.1:27017/euroxxxvi"

        match = Match()
        match.key="KEYMATCH"
        match.resultA=2
        match.resultB=1

        #case exact result
        bet = Bet()
        bet.key="KEYMATCH"
        bet.resultA=2
        bet.resultB=1
        match.computeResult(bet)
        self.assertEqual(13, bet.nbpoints)

    def test_no_score(self):
        os.environ['OPENSHIFT_MONGODB_DB_URL'] = u"mongodb://mmxvi:eurommxvi@127.0.0.1:27017/euroxxxvi"

        match = Match()
        match.key = "KEYMATCH"
        match.resultA = 2
        match.resultB = 1

        #case no match
        bet = Bet()
        bet.key = "KEYMATCH"
        bet.resultA = 5
        bet.resultB = 5
        match.computeResult(bet)
        self.assertEqual(0, bet.nbpoints)

    def test_just_1n2(self):
        os.environ['OPENSHIFT_MONGODB_DB_URL'] = u"mongodb://mmxvi:eurommxvi@127.0.0.1:27017/euroxxxvi"

        match = Match()
        match.key = "KEYMATCH"
        match.resultA = 2
        match.resultB = 1

        # case just 1 or N or 2
        bet = Bet()
        bet.key = "KEYMATCH"
        bet.resultA = 50
        bet.resultB = 5
        match.computeResult(bet)
        self.assertEqual(5, bet.nbpoints)

        match = Match()
        match.key = "KEYMATCH"
        match.resultA = 1
        match.resultB = 2
        bet = Bet()
        bet.key = "KEYMATCH"
        bet.resultA = 5
        bet.resultB = 50
        match.computeResult(bet)
        self.assertEqual(5, bet.nbpoints)

        #for null match : 5pts + 2 because right diff of goal
        match = Match()
        match.key = "KEYMATCH"
        match.resultA = 2
        match.resultB = 2
        bet = Bet()
        bet.key = "KEYMATCH"
        bet.resultA = 50
        bet.resultB = 50
        match.computeResult(bet)
        self.assertEqual(7, bet.nbpoints)

    def test_just_diff(self):
        os.environ['OPENSHIFT_MONGODB_DB_URL'] = u"mongodb://mmxvi:eurommxvi@127.0.0.1:27017/euroxxxvi"

        match = Match()
        match.key = "KEYMATCH"
        match.resultA = 2
        match.resultB = 1
        # case just 1 or N or 2
        bet = Bet()
        bet.key = "KEYMATCH"
        bet.resultA = 5
        bet.resultB = 6
        match.computeResult(bet)
        self.assertEqual(2, bet.nbpoints)

        match = Match()
        match.key = "KEYMATCH"
        match.resultA = 1
        match.resultB = 2
        bet = Bet()
        bet.key = "KEYMATCH"
        bet.resultA = 51
        bet.resultB = 50
        match.computeResult(bet)
        self.assertEqual(2, bet.nbpoints)


    def test_just_1N2_diff(self):
        os.environ['OPENSHIFT_MONGODB_DB_URL'] = u"mongodb://mmxvi:eurommxvi@127.0.0.1:27017/euroxxxvi"

        match = Match()
        match.key = "KEYMATCH"
        match.resultA = 2
        match.resultB = 1
        # case just 1 or N or 2
        bet = Bet()
        bet.key = "KEYMATCH"
        bet.resultA = 6
        bet.resultB = 5
        match.computeResult(bet)
        self.assertEqual(7, bet.nbpoints)

        match = Match()
        match.key = "KEYMATCH"
        match.resultA = 1
        match.resultB = 2
        bet = Bet()
        bet.key = "KEYMATCH"
        bet.resultA = 49
        bet.resultB = 50
        match.computeResult(bet)
        self.assertEqual(7, bet.nbpoints)


if __name__ == '__main__':
    unittest.main()
