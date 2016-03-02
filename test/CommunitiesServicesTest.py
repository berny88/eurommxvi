import unittest, os
from communities.CommunityServices import Community, CommunityManager

class TestCommunities(unittest.TestCase):

    def test_userconstructor(self):
        u = Community()
        self.assertEqual(u.description, u"")
        self.assertEqual(u.title, u"")
        self.assertEqual(u.com_id, u"")

    def test_getallcommunities(self):
        os.environ['OPENSHIFT_MONGODB_DB_URL']=u"mongodb://mmxvi:eurommxvi@127.0.0.1:27017/euroxxxvi"
        mgr = CommunityManager()
        self.assertIsNotNone(mgr.getDb())

        coms = mgr.getAllCommunities()
        for u in coms:
            print(u)
        self.assertIsNotNone(coms)

    def test_getsavecommunity(self):
        os.environ['OPENSHIFT_MONGODB_DB_URL']=u"mongodb://mmxvi:eurommxvi@127.0.0.1:27017/euroxxxvi"
        mgr = CommunityManager()

        #usera = mgr.saveUser("email@test.fr", "", "", "uuidxxx", False)

        #user = mgr.getUserByEmail(u"email@test.fr")


        self.assertIsNotNone(mgr)



if __name__ == '__main__':
    unittest.main()
