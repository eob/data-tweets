class Listener:
  """

  """
  def __init__(self, config, sinkFn, twitter):
    self.config = config
    self.sinkFn = sinkFn
    self.twitter = twitter

  def fetch_direct_messages(self):
     statuses = self._api.GetDirectMessages(page=1)
     print statuses

  def start(self):
    pass



