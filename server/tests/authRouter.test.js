const express = require('express');
const bodyParser = require('body-parser');
const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('Auth Router', function() {
  let app, jwtStub, authRouter;

  beforeEach(() => {
    app = express();
    app.use(bodyParser.json());

    jwtStub = sinon.stub().returns('fakeToken');

    authRouter = proxyquire('../routes/authRouter', {
      '../controllers/authController': {
        login: (req, res) => {
          res.status(200).json({ authToken: jwtStub() });
        },
        qrCode: (req, res) => {
          res.status(200).send('QR Code Image');
        },
        set2FA: (req, res) => {
          res.status(200).send('2FA Enabled');
        }
      }
    });

    app.use(authRouter);
  });

  afterEach(() => {
    //jwtStub.restore();
  });

  describe('POST /login', function() {
    it('should return 200 status code and a JWT token for successful login', function(done) {
      request(app)
        .post('/login')
        .send({ emailOrPhone: 'validUser@example.com', password: 'validPassword' })
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.have.property('authToken', 'fakeToken');
          done(err);
        });
    });
  });

  describe('GET /qrimage', function() {
    it('should return 200 status code for successful QR code retrieval', function(done) {
      request(app)
        .get('/qrimage')
        .expect(200)
        .expect('QR Code Image', done);
    });
  });

  describe('GET /set2FA', function() {
    it('should return 200 status code for successful 2FA setup', function(done) {
      request(app)
        .get('/set2FA')
        .expect(200)
        .expect('2FA Enabled', done);
    });
  });
});
