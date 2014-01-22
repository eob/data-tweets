from persistence import SimpleFilePersistence as Persistence
from parser import parse_tweet
from listener import Listener

class Router:
  def __init__(self, config):
    self.config = config

  def start(self):
    self.persistence= Persistence(self.config)
    self.persistence.open()
    self.listener = Listener(self.config, self.handleNewTweet)
  
  def stop(self):
    self.persistence.close()

  def handleNewTweet(self, tweet):
    """This gets called by the listener when there is a new tweet to record."""
    data = parse_tweet(tweet)
    persistence.record(data)

