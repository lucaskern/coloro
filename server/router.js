const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
    // app.get('*', mid.requiresSecure, controllers.Lost.lostPage);
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getColors', mid.requiresLogin, controllers.Color.getColors);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  // app.get('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signupPage);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/colors', mid.requiresLogin, controllers.Color.colorPage);
  app.post('/colors', mid.requiresLogin, controllers.Color.makeColor);
  app.get('/premium', mid.requiresLogin, controllers.Premium.premiumPage);
  app.get('/acct', mid.requiresLogin, controllers.Acct.AcctPage);
  app.get('/passchange', mid.requiresLogin, controllers.Color.colorPage);
  app.post('/passchange', mid.requiresLogin, controllers.Color.makeColor);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
