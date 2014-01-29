from persistence import SimpleFilePersistence as Persistence
from parser import parse_tweet
from listener import Listener
from bot import Bot
import signal, sys, os
import json

if __name__ == "__main__":
  config_json = open('settings.json')
  config = json.load(config_json)
  config_json.close()
  bots = []

  for account in config['accounts']:
    bot = Bot(account, config)
    bots.append(bot)

  def signal_handler(signal, frame):
    for bot in bots:
      bot.stop()
    sys.exit(0)

  signal.signal(signal.SIGINT, signal_handler)

  for bot in bots:
    bot.start()

  while True:
    pass

