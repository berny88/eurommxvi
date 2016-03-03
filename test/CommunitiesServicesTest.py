import unittest, os
from communities.CommunityServices import Community, CommunityManager
from users.UserServices import User


class TestCommunities(unittest.TestCase):
    def test_userconstructor(self):
        com = Community()
        self.assertEqual(com.description, u"")
        self.assertEqual(com.title, u"")
        self.assertEqual(com.com_id, u"")

        com.description = u"descr"
        com.title = u"title"
        com.com_id = u"xxxxx1"
        adms = list()
        u = User()
        u.email = u"toto@toto.com"
        adms.append(u)
        com.admins = adms

        bson = com.convertIntoBson()
        self.assertEqual(bson["description"], u"descr")
        self.assertEqual(bson["title"], u"title")
        self.assertEqual(bson["com_id"], u"xxxxx1")
        self.assertEqual(bson["admins"][0]["email"], u"toto@toto.com")

        bson["description"] = u"totodescr"
        bson["title"] = u"tototitle"
        bson["com_id"] = u"totocomid"
        com.convertFromBson(bson)
        self.assertEqual(com.description, u"totodescr")
        self.assertEqual(com.title, u"tototitle")
        self.assertEqual(com.com_id, u"totocomid")

    def test_crudcommunities(self):
        """

        :rtype: object
        """
        os.environ['OPENSHIFT_MONGODB_DB_URL'] = u"mongodb://mmxvi:eurommxvi@127.0.0.1:27017/euroxxxvi"
        mgr = CommunityManager()
        self.assertIsNotNone(mgr.getDb())

        coms = mgr.getAllCommunities()
        self.assertEqual(len(coms), 0)

        c=Community()
        c.title=u"thetitle"
        c.description=u"thedescription"
        c.admins=list()
        c2 = mgr.save(c)
        coms = mgr.getAllCommunities()
        for u in coms:
            print(u)
        self.assertEqual(len(coms), 1)

        c2 = mgr.save(c2)
        coms = mgr.getAllCommunities()
        self.assertEqual(len(coms), 1)

        mgr.delete(c)
        coms = mgr.getAllCommunities()
        self.assertEqual(len(coms), 0)

    def test_populatecommunities(self):
        os.environ['OPENSHIFT_MONGODB_DB_URL'] = u"mongodb://mmxvi:eurommxvi@127.0.0.1:27017/euroxxxvi"
        mgr = CommunityManager()
        self.assertIsNotNone(mgr.getDb())

        # c=Community()
        # c.title=u"thetitle1"
        # c.description=u"thedescription1"
        # c.admins=list()
        # c2 = mgr.save(c)
        # c=Community()
        # c.title=u"thetitle2"
        # c.description=u"thedescription2"
        # c.admins=list()
        # c2 = mgr.save(c)
        # c2 = mgr.save(c)
        # coms = mgr.getAllCommunities()
        # for u in coms:
        #     print(u)


if __name__ == '__main__':
    unittest.main()
