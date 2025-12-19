'user strict';

const express = require('express'),
    //morgan = require('morgan'),
    config = require('./config'),
    router = require('./router'),
    bodyParser = require('body-parser'),
    db = require('./orm')


    
    
    
const sjs = require('sequelize-json-schema');


const app = express();

// Disable Express technology exposure (Fix V5)
app.disable("x-powered-by");

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:"
  );

  // Clickjacking protection (V3 Fix)
  res.setHeader("X-Frame-Options", "DENY");

  next();
});




const PORT = config.PORT;

//OPTIONAL: Activate Logging
// app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//session middleware
var cookieParser = require('cookie-parser');

var session = require('express-session');
const SessionCookie =  {
  secure: false,
  httpOnly: false,
  sameSite: "lax",
  maxAge: 1000 * 60 * 60 * 60 * 24 * 2//2 day
} 
app.use(session({
  genid:function(req){
    if ((req.session) && (req.session.uid)) {
      return req.session.uid + "_" + 123;
    } else {
      return new Date().getTime().toString();
    }
  },

  resave: false,
  saveUninitialized: false,

  secret: process.env.SESSION_SECRET || 'SuperSecret',

  name:'sessionID',

  cookie: {
    httpOnly: true,          // Prevent JS access → stop XSS session theft
    secure: false,           // true in production (HTTPS)
    sameSite: 'strict',      // protect from CSRF
    maxAge: 1000 * 60 * 60   // 1 hour
  }
}))
app.use(cookieParser());

router(app, db);

//drop and resync with { force: true } normal with alter:true
db.sequelize.sync({alter:true}).then(() => {
    app.listen(PORT, () => {
      console.log('Express listening on port:', PORT);
    });
  });

const expressJSDocSwagger = require('express-jsdoc-swagger');

const docOptions = {
  info: {
    version: '1.0.0',
    title: 'Damn vulnerable app',
    license: {
      name: 'MIT',
    },
  },
  security: {
    BearerAuth: {
      type: 'http',
      scheme: 'bearer',
    },
  },
  baseDir: __dirname,
  // Glob pattern to find your jsdoc files (multiple patterns can be added in an array)
  filesPattern: './../**/*.js',
  // URL where SwaggerUI will be rendered
  swaggerUIPath: '/api-docs',
  // Expose OpenAPI UI
  exposeSwaggerUI: true,
  // Expose Open API JSON Docs documentation in `apiDocsPath` path.
  exposeApiDocs: true,
  // Open API JSON Docs endpoint.
  apiDocsPath: '/v1/api-docs',
  // Set non-required fields as nullable by default
  notRequiredAsNullable: false,
  // You can customize your UI options.
  // you can extend swagger-ui-express config. You can checkout an example of this
  // in the `example/configuration/swaggerOptions.js`
  swaggerUiOptions: {},
  // multiple option in case you want more that one instance
  multiple: true,
};

  //const swaggerDocs = expressJSDocSwagger(swaggerOptions);

expressJSDocSwagger(app)(docOptions);
  //app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  
  //generate schemas from sequelize
  const options = {exclude: ['id', 'createdAt', 'updatedAt']};
sjs.getSequelizeSchema(db.sequelize, options);

const expressNunjucks = require('express-nunjucks');
app.set('views', __dirname + '/templates');
const njk = expressNunjucks(app, {
  watch: true,
  noCache: true
});

//expose css, js
app.use(express.static('src/public'))

//form handler
const formidableMiddleware = require('express-formidable');

app.use(formidableMiddleware());
// Global error handler (keep server alive during aggressive scans like ZAP)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  if (res.headersSent) return next(err);
  return res.status(500).json({ error: "Internal Server Error" });
});

// Avoid crashing on unhandled promise rejections during scans
process.on("unhandledRejection", (reason) => {
  console.error("UnhandledRejection:", reason);
});

// Avoid crashing on unexpected sync exceptions
process.on("uncaughtException", (err) => {
  console.error("UncaughtException:", err);
});
