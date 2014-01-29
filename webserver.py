from jinja2 import Environment, FileSystemLoader
import os, os.path
import bot, json
from bot.persistence import SimpleFilePersistence as Persistence

env = Environment(loader=FileSystemLoader('templates'))
current_dir = os.path.dirname(os.path.abspath(__file__))

import cherrypy

class Root:
  def __init__(self):
    config_json = open('conf/twitter-daemon-conf.json')
    self.bot_global_config = json.load(config_json)
    config_json.close()

    self.bots = {}
    for local_config in self.bot_global_config['accounts']:
      name = local_config['name']
      persistence = Persistence(local_config, self.bot_global_config)
      self.bots[name] = {
        'local_config': local_config,
        'persistence': persistence
      }

  @cherrypy.expose
  def index(self):
    bots = []
    for name in self.bots:
      bot = self.bots[name]
      data = {'name': name, 'tweets': []}
      for tweet in bot['persistence'].tweets():
        kk = []
        vv = []
        for k in tweet['parsed']['properties']:
          v = tweet['parsed']['properties'][k]
          kk.append(k)
          vv.append(v)
        tweet['kk'] = kk
        tweet['vals'] = vv
        data['tweets'].append(tweet)
      bots.append(data)
    content = env.get_template('botlist.html').render({'bots':bots})
    index = env.get_template('index.html').render(content=content)
    return index

cherrypy.config.update("conf/webserver-global.conf")
cherrypy.tree.mount(Root(),"/","conf/webserver-config.conf")
cherrypy.engine.start()
cherrypy.engine.block()

