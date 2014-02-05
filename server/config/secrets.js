module.exports = {
  db: 'localhost',

  sessionSecret: "Your Session Secret goes here",

  sendgrid: {
    user: 'Your SendGrid Username',
    password: 'Your SendGrid Password'
  },

  nyt: {
    key: 'Your New York Times API Key'
  },

  lastfm: {
    api_key: 'Your API Key',
    secret: 'Your API Secret'
  },

  facebook: {
    clientID: 'Your App ID',
    clientSecret: 'Your App Secret',
    callbackURL: '/auth/facebook/callback',
    passReqToCallback: true
  },

  github: {
    clientID: 'Your Client ID',
    clientSecret: 'Your Client Secret',
    callbackURL: '/auth/github/callback',
    passReqToCallback: true
  },

  twitter: {
    consumerKey: 't4VgnzhmEJAPz2KJzbUdzA',
    consumerSecret: 'TilIUYZRqxPrYIBDxVsYOUQzSWcGmzXyqGV0Fht634',
    callbackURL: 'http://box.csail.mit.edu/auth/twitter/callback',
    userAuthorizationURL: 'https://api.twitter.com/oauth/authorize',
    passReqToCallback: true
  },

  google: {
    clientID: '611397698570-34q1q8a0gc17e042vh0k4t3u7024g392.apps.googleusercontent.com',
    clientSecret: 's1qxIko-sWn4klO_iPKuUaK1',
    callbackURL: '/auth/google/callback',
    passReqToCallback: true
  },

  tumblr: {
    consumerKey: 'Your Consumer Key',
    consumerSecret: 'Your Consumer Secret',
    callbackURL: '/auth/tumblr/callback'
  },

  foursquare: {
    clientId: 'Your Client ID',
    clientSecret: 'Your Client Secret',
    redirectUrl: 'http://localhost:3000/auth/foursquare/callback'
  },

  paypal: {
    host: 'api.sandbox.paypal.com', // or api.paypal.com
    client_id: 'Your Client ID',
    client_secret: 'Your Client Secret',
    returnUrl: 'http://localhost:3000/api/paypal/success',
    cancelUrl: 'http://localhost:3000/api/paypal/cancel'
  }
};
