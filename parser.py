def parse_tweet_text(text, intoDict = None):
  """Returns a dict.

  Every hash tag is a dictionary key, all that follows, up until the next hash tag, is
  the the value.
  """

  if intoDict is None:
    ret = {}
  else:
    ret = intoDict

  parts = text.split(" ")

  key = None
  val = []

  def flush(key, val):
    if key is not None:
      if len(val) == 0:
        ret[key] = True
      else:
        ret[key] = " ".join(val)
      key = None
      val = []

  for part in parts:
    if part[0] == '#':
      flush(key, val)
      key = part
      val = []
    else:
      if key is not None:
        val.append(part)
  flush(key, val)
  return ret


def parse_tweet(status):
  """Parses a tweet object and returns a dict.

  Args:
    - A status object, as defined by the python-twitter library.

  Returns:
    - A dict with the following properties:
      - user
      - user-hash
      - lat, lng
      - datetime
      - parsed tweet text
  """
  ret['user'] = status.user.GetScreenName()
  ret['coordinates'] = status.GetCoordinates()
  ret['created_at'] = status.GetCreatedAt()
  ret['id'] = status.GetId()

  # Let's just get rid of line breaks in tweets. It makes cheap file serialization easier.
  text = status.GetText().replace('\n', ' ').replace('\r', '')

  ret['text'] = text
  parse_tweet_text(text, ret)
  return ret


def test_parse_tweet_text():
  t1 = "This is a #test of it."
  t2 = "#one #two #three"
  t3 = "#x 12 #y 34 that's all folks"
  t4 = "#z #x 12 #y one hundred"
  
  t = [t1, t2, t3, t4]
  for tt in t:
    ret = parse_tweet_text(tt)
    print tt
    print ret
    print ""
