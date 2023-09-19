// const { Middleware } = require('swagger-express-middleware');
const http = require('http');
const fs = require('fs');
const path = require('path');
const swaggerUI = require('swagger-ui-express');
const jsYaml = require('js-yaml');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { OpenApiValidator } = require('express-openapi-validator');
const logger = require('./logger');
const config = require('./config');
const { createuser } = require('./services/UserService');
const { User } = require('./models/User');

class ExpressServer {
  constructor(port, openApiYaml) {
    this.port = port;
    this.app = express();
    this.openApiPath = openApiYaml;
    try {
      this.schema = jsYaml.safeLoad(fs.readFileSync(openApiYaml));
    } catch (e) {
      logger.error('failed to start Express Server', e.message);
    }
    this.setupMiddleware();
  }

  setupMiddleware() {
    // this.setupAllowedMedia();
    this.app.use(cors());
    this.app.use(bodyParser.json({ limit: '14MB' }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    //Simple test to see that the server is up and responding
    this.app.get('/hello', (req, res) => res.send(`Hello World. path: ${this.openApiPath}`));
    //Send the openapi document *AS GENERATED BY THE GENERATOR*
    this.app.get('/openapi', (req, res) => res.sendFile((path.join(__dirname, 'api', 'openapi.yaml'))));
    //View the openapi document in a visual interface. Should be able to test from this page
    this.app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(this.schema));
    this.app.get('/login-redirect', (req, res) => {
      res.status(200);
      res.json(req.query);
    });
    this.app.get('/oauth2-redirect.html', (req, res) => {
      res.status(200);
      res.json(req.query);
    });

    this.app.post('/v1/register', (req, res) => {
      const { useremail, password } = req.body;
    
      // Check if the useremail is already taken
      // const userExists = users.some((user) => user.useremail === useremail);
      const userExists = false;
    
      if (userExists) {
        res.status(400).json({ message: 'useremail already exists' });
      } else {
        // If useremail is unique, create a new user
        const user = { useremail, password };
        // users.push(newUser);
        createuser({user});
        res.status(201).json({ message: 'Registration successful', user: user });
      }
    });

    this.app.post('/v1/login', async (req, res) => {
      console.log(req.body)
      const { useremail, password } = req.body;
      
    
      // Check if the user exists in the simulated database
      // const user = users.find((user) => user.useremail === useremail && user.password === password);
    
      try {
        // Find a user with the provided useremail and password
        const user = await User.findOne({ useremail, password });
    
        if (user) {
          // If user exists, return the user data
          res.json( {user});
        } else {
          // If user doesn't exist or password is incorrect, return an error
          res.status(401).json({ message: 'Authentication failed' });
        }
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    });
  }

  launch() {
    new OpenApiValidator({
      apiSpec: this.openApiPath,
      operationHandlers: path.join(__dirname),
      validateRequests: false,
      fileUploader: { dest: config.FILE_UPLOAD_PATH },

    }).install(this.app)
      .catch(e => console.log(e))
      .then(() => {
        // eslint-disable-next-line no-unused-vars
        this.app.use((err, req, res, next) => {
          // format errors
          res.status(err.status || 500).json({
            message: err.message || err,
            errors: err.errors || '',
          });
        });

        http.createServer(this.app).listen(this.port);
        console.log(`Listening on port ${this.port}`);
      });
  }


  async close() {
    if (this.server !== undefined) {
      await this.server.close();
      console.log(`Server on port ${this.port} shut down`);
    }
  }
}

module.exports = ExpressServer;
