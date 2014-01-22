from logger import Logger
from parser import parse_tweet

class Router:
  def __init__(self, config):
    self.config = config

  def start():
    self.logger = Logger(self.config)
    self.logger.open()
  
  def stop():
    self.logger.close()

  def handleNewTweet(tweet):
    data = parse_tweet(tweet)
    logger.log(data)

