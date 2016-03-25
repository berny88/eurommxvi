import unittest, os
from communities.BlogsServices import Blog, BlogsManager



class TestBlogs(unittest.TestCase):
    def test_crud(self):
        for i in range(1,40) :
            d= dict()
            d["title"]="Blog Post "+str(i)
            d["com_id"]= "com_id_001"
            d["likes"]=2
            d["createdOn"] = 1408547127216
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
            print(blog.__dict__)
            self.assertEqual(blog.title, d["title"])
            self.assertEqual(len(blog.body), len(d["body"]))
            self.assertEqual(blog.likes, d["likes"])
            self.assertEqual(len(blog.comments), len(d["comments"]))
            self.assertEqual(blog.createdOn, d["createdOn"])






if __name__ == '__main__':
    unittest.main()
