import json
import tempfile, shutil, os
import os.path
import uuid

class SimpleFilePersistence:
  def __init__(self, my_config, global_config):
    self.my_config = my_config
    self.global_config = global_config

    # Ensure output directory
    d = global_config['persistence']['output_dir']
    if not os.path.exists(d):
      print "Creating directory " + global_config['persistence']['output_dir']
      os.makedirs(d)
    self.fname = os.path.join(global_config['persistence']['output_dir'],
        my_config['name'] + '.dat')

  def tweets(self):
    if os.path.isfile(self.fname):
      temp_dir = tempfile.gettempdir()
      temp_path = os.path.join(temp_dir, str(uuid.uuid4()))
      shutil.copy2(self.fname, temp_path)
      f = open(temp_path, 'r')
      for line in f:
        row = json.loads(line)
        yield row
      f.close()

  def open(self):
    self.fout = open(self.fname, 'a')

  def close(self):
    self.fout.close()

  def record(self, tweetData):
    s = json.dumps(tweetData)
    self.fout.write(s + "\n")
