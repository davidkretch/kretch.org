#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = 'David Kretch'
SITENAME = 'David Kretch'
SITEURL = ''

PATH = 'content'

TIMEZONE = 'America/New_York'

DEFAULT_LANG = 'en'

DIRECT_TEMPLATES = ['index']

# Navbar menu items
MENUITEMS = (('Contact', 'mailto:david.kretch@gmail.com', 'envelope'),)

DEFAULT_PAGINATION = False

DEFAULT_DATE_FORMAT = '%d %B %Y'

SUMMARY_MAX_LENGTH = 75

TYPOGRIFY = True

# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True

THEME = 'themes/bootstrap-blog'

# Disable syndication feeds
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# Disable author and category pages
AUTHOR_SAVE_AS = False
CATEGORY_SAVE_AS = False
