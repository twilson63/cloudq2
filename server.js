var app = require('apprentice');
require('./app');
app.httpServer.listen(3000);

module.exports = app;