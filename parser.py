def parse_tweet_text(text, intoDict = None):
  """Returns a dict.

  @thing #expname #tag1 k:v k:v #tag2
  """
  data = {
    'tags': [],
    'experiment': '',
    'properties': {}
  }

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

  firstPart = True
  for part in parts:
    if part[0] == '#':
      # It's a tag
      data['tags'].append(part[1:])
      if firstPart:
        data['experiment'] = part[1:]
    elif ':' in part:
      kv = part.split(':')
      k = kv[0]
      v = ''.join(kv[1:])
      data['properties'][k] = v
    firstPart = False

  if intoDict is None:
    intoDict = {}
  intoDict['parsed'] = data
  return intoDict


def parse_tweet_text_old(text, intoDict = None):
  """Returns a dict.

  @thing #key value #key value #tag #tag
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

def parse_dm(status):
  """Parses a DM and returns a dict.

  Interesting wrinkle: DMs aren't geocoded.

  Args:
    - A status object, as defined by the python-twitter library.

  Returns:
    - A dict with the following properties:
      - user
      - datetime
      - parsed tweet text
  """
  ret = {}
  ret['sender_screen_name'] = status.sender_screen_name
  ret['created_at'] = status.created_at
  ret['id'] = status.id

  # Let's just get rid of line breaks in tweets. It makes cheap file serialization easier.
  text = status.text.replace('\n', ' ').replace('\r', '')

  ret['text'] = text
  parse_tweet_text(text, ret)
  return ret

def parse_tweet(status):
  """Parses a tweet object and returns a dict.

  Args:
    - A status object, as defined by the python-twitter library.

  Returns:
    - A dict with the following properties:
      - user
      - lat, lng
      - datetime
      - parsed tweet text
  """
  ret = {}
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
