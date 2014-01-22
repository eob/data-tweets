import json

class SimpleFilePersistence:
  def __init__(config):
    self.config = config
    self.fname = config.get('Logging', 'filename', 0)

  def open():
    self.fout = open(self.fname, 'w')

  def close():
    self.fout.close()

  def record(tweetData):
    s = json.dumps(tweetData)
    self.fout.write(s)
