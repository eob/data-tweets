from persistence import SimpleFilePersistence as Persistence
from parser import parse_tweet, parse_dm
from listener import Listener
import twitter as twitter_library

class Bot:
  def __init__(self, my_config, global_config):
    self.my_config = my_config
    self.global_config = global_config
    self.last_ids = {}
    self.initialize_twitter()

  def start(self):
    print "Starting Bot: %s..\n Press Ctrl-C to exit" % self.my_config['name']
    self.persistence= Persistence(self.my_config, self.global_config)
    for tweet in self.persistence.tweets():
      self.observe_tweet(tweet)
    self.persistence.open()
    self.listener = Listener(self.my_config, self.handle_new_tweet, self.twitter)
    self.listener.start()

  def stop(self):
    print "\nShutting down Bot: %s" % self.my_config['name']
    self.persistence.close()

  def is_novel(self, tweet):
    if tweet['method'] not in self.last_ids:
      return True
    if tweet['id'] > self.last_ids[tweet['method']]:
      return True
    return False

  def observe_tweet(self, tweet):
    if tweet['method'] not in self.last_ids:
      self.last_ids[tweet['method']] = tweet['id']
    else:
      if tweet['id'] > self.last_ids[tweet['method']]:
        self.last_ids[tweet['method']] = tweet['id']

  def handle_new_tweet(self, tweet, method):
    """This gets called by the listener when there is a new tweet to record."""
    if method == 'direct_message':
      data = parse_dm(tweet)
    else:
      data = parse_tweet(tweet)
    data['method'] = method
    print data
    if self.is_novel(data):
      print "It's a novel tweet"
      self.observe_tweet(data)
      self.persistence.record(data)

  def initialize_twitter(self):
    self.twitter = twitter_library.Api(
        access_token_key=self.my_config['access_token'],
        access_token_secret=self.my_config['token_secret'],
        consumer_key=self.global_config['global_token'],
        consumer_secret=self.global_config['global_secret'],
        cache=None)

