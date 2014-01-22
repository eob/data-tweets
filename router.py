from persistence import SimpleFilePersistence as Persistence
from parser import parse_tweet

class Router:
  def __init__(self, config):
    self.config = config

  def start():
    self.persistence= Persistence(self.config)
    self.persistence.open()
  
  def stop():
    self.persistence.close()

  def handleNewTweet(tweet):
    data = parse_tweet(tweet)
    persistence.record(data)

