module.exports = function(app) {
  var application = app.controllers.application;
  app.get('/', application.index);
  app.post('/login', application.login);
  app.post('/logout', application.logout);
};
