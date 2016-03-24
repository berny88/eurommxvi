import unittest, os
from datetime import datetime

class DateTest(unittest.TestCase):

    def test_date(self):
        currDate = datetime.utcnow()
        print(currDate)
        d = datetime.strptime("2016-06-22T17:00:00Z", "%Y-%m-%dT%H:%M:%SZ")
        print(d)
        if d >currDate:
            print("{} > {}".format(d, currDate))


if __name__ == '__main__':
    unittest.main()
