const express = require('express');
const cors = require('cors');
const config = require('./config/app.js');
const compression = require('compression');
const routes = require('./routes');
const errorHandler = require('express-json-errors');
const middlewareErrorParser = require('./middleware/ErrorParser');
const middlewarePathLogger = require('./middleware/PathLogger');
const fileUpload = require('express-fileupload');

const app = express();

app.use(express.json({type: "application/json"}));
app.use(express.urlencoded({ extended: false }));
app.use(express.static('uploads'));

app.use(fileUpload({
  createParentPath: true,
  limits: { 
    fileSize: 5 * 1024 * 1024 * 1024 //2MB max file(s) size
},
}));

// add cors headers
app.use(cors());
// comporess output
app.use(compression());

// only on debug mode
if(config.debug){
    // path logger
    app.use(middlewarePathLogger);
}

// use routes
app.use('/', routes);

app.use(middlewareErrorParser);

// Start server
app.listen(config.port, () => {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
module.exports = app;