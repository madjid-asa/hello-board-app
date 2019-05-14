const morgan      = require('morgan');
const compression = require('compression');
const serveStatic = require('serve-static');

module.exports = function(app, express){
    app.set('port', process.env.PORT || 3000);
    app.use(morgan('dev'));
    app.use(compression());
    app.use(serveStatic(`public`));
    const expressWs   = require('express-ws')(app);

};
