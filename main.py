#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

import logging
import webapp2
from ci_token import CI_TOKEN, CI_PROJECT, \
    CI_USER  # make ci_token.py file and set CircleCI API token into CI_TOKEN variable, and fill CI_PROJECT and CI_USER
from google.appengine.api import urlfetch


class MainHandler(webapp2.RequestHandler):
    def get(self):
        self.response.write('Hello world!')


class CIHandler(webapp2.RequestHandler):
    def get(self):
        api_url = 'https://circleci.com/api/v1/project/%s/%s/tree/master?circle-token=%s' % (
            CI_USER, CI_PROJECT, CI_TOKEN)
        logging.info(api_url)
        r = urlfetch.fetch(
            url=api_url,
            method=urlfetch.POST,
            deadline=30,
            follow_redirects=False,
        )
        logging.info(r.status_code)
        logging.info(r.content)
        if r.status_code == 201:
            self.response.write('Request sent to CircleCI')
        else:
            self.response.status = 500
            self.response.write('Error! :Request sent to CircleCI')


app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/admin/', CIHandler),
], debug=True)
