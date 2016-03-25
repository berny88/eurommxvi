import unittest, os
from communities.BlogsServices import Blog, BlogsManager



class TestBlogs(unittest.TestCase):

    def test_emptyblog(self):
        os.environ['OPENSHIFT_MONGODB_DB_URL'] = u"mongodb://mmxvi:eurommxvi@127.0.0.1:27017/euroxxxvi"
        mgr = BlogsManager()
        l = mgr.getBlogByCommunity("zozozozozooz")
        self.assertEqual(0, len(l))

    def test_crud(self):
        os.environ['OPENSHIFT_MONGODB_DB_URL'] = u"mongodb://mmxvi:eurommxvi@127.0.0.1:27017/euroxxxvi"
        mgr = BlogsManager()
        for i in range(1,40) :
            d= dict()
            d["title"]="Blog Post "+str(i)
            d["com_id"]= "com_id_001"
            d["likes"]=i
            d["createdOn"] = 1408547127216+i
            body = list()
            body.append("Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem deleniti quae, "
                        "neque libero voluptate maiores ullam unde voluptatem assumenda velit dolores impedit "
                        "quis qui! Neque, cupiditate labore nulla? Atque, tenetur.")
            body.append("Numquam nobis nam voluptas blanditiis eveniet in quasi possimus voluptatem temporibus doloremque "
                        "delectus dolorum, voluptatum laborum aut dolorem? In rerum necessitatibus soluta incidunt "
                        "nihil numquam fugit quas pariatur dolores nesciunt?")
            d["body"]= body
            d["author"]="Nick Moreton"
            comments=list()
            comment=dict()
            comment["body"]="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos possimus porro " \
                            "earum dolor sint fuga laborum velit laudantium distinctio quos sunt veritatis unde inventore," \
                            " autem ad tenetur voluptatibus mollitia vel!"
            comment["author"]= "trollguy87"
            comments.append(comment)
            d["comments"]=comments
            blog = Blog()
            blog.convertFromJson(d)
            print(blog)
            self.assertEqual(blog.title, d["title"])
            self.assertEqual(len(blog.body), len(d["body"]))
            self.assertEqual(blog.likes, d["likes"])
            self.assertEqual(len(blog.comments), len(d["comments"]))
            self.assertEqual(blog.createdOn, d["createdOn"])
            json=blog.convertIntoJson()
            self.assertEqual(blog.createdOn, json["createdOn"])
            self.assertEqual(blog.title, json["title"])
            self.assertEqual(len(blog.body), len(json["body"]))
            self.assertEqual(blog.likes, json["likes"])
            self.assertEqual(len(blog.comments), len(json["comments"]))
            mgr.createBlog(blog)
            self.assertGreater( len(blog.blog_id), 0)
            print(blog.blog_id)
            blogs = mgr.getBlogByCommunity("com_id_001")
            self.assertEqual(1, len(blogs))
            res = mgr.deleteBlog(blog)
            self.assertEqual(1, res)
            blogs = mgr.getBlogByCommunity("com_id_001")
            self.assertEqual(0, len(blogs))







if __name__ == '__main__':
    unittest.main()
