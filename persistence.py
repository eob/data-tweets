import json

class SimpleFilePersistence:
  def __init__(self, config):
    self.config = config
    self.fname = config.get('Logging', 'filename', 0)

  def open(self):
    self.fout = open(self.fname, 'w')

  def close(self):
    self.fout.close()

  def record(self, tweetData):
    s = json.dumps(tweetData)
    self.fout.write(s)
