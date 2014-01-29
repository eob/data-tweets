import threading

class Listener:
  """

  """
  def __init__(self, config, sinkFn, twitter):
    self.config = config
    self.sinkFn = sinkFn
    self.twitter = twitter

  def fetch_direct_messages(self):
     statuses = self.twitter.GetDirectMessages()
     for status in statuses:
       self.sinkFn(status, 'direct_message')

  def loop(self):
    self.fetch_direct_messages()
    nextTime = threading.Timer(60, self.loop)
    # This keeps the Ctrl-C signal going to the main() routine
    # But if the thread is executing while Ctrl-C is pressed there
    # may be strange error messages upon exit as a result.
    nextTime.daemon = True
    nextTime.start()

  def start(self):
    self.loop()

