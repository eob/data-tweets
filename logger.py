import json

class Logger:
  def __init__(config):
    self.config = config
    self.fname = config.get('Logging', 'filename', 0)

  def open():
    self.fout = open(self.fname, 'w')

  def close():
    self.fout.close()

  def log(tweetData):
    s = json.dumps(tweetData)
    self.fout.write(s)
