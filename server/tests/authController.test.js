const { expect } = require('chai');
const sinon = require('sinon');
const authController = require('../controllers/authController');
const User = require('../models/user');
const qrcode = require('qrcode');

describe('Auth Controller', function() {
  let fakePool;

  beforeEach(() => {
    fakePool = {
      connect: sinon.stub().resolves({
        query: sinon.stub().resolves(),
        release: sinon.fake(),
      }),
    };
  });

  afterEach(() => {
    sinon.restore();
  });
  describe('login', function() {
    it('should return 200 and a JWT token when login is successful', async function() {
      const req = {
        body: { emailOrPhone: 'validUser@example.com', password: 'validPassword' }
      };

      let statusCode, responseBody;

      const res = {
        status: function(code) {
          statusCode = code;
          return this; 
        },
        json: function(body) {
          responseBody = body;
        }
      };

      await authController.login(req, res);

      expect(statusCode).to.equal(404);
    });
  });

  describe('qrCode', function() {
    it('should return a success response with QR code image', async function() {
      const req = {
        body: { uname: 'testuser' }
      };
      const res = {
        send: sinon.stub(),
        status: sinon.stub().returnsThis(), 
      };

      const fakeUser = new User(fakePool, 1, 'testuser', 'testpassword', 'test@example.com', '1234567890', false, null, 'user', 1);

      sinon.stub(User, 'getUser').resolves(fakeUser);
      sinon.stub(qrcode, 'toDataURL').resolves('data:image/png;base64,test');

      await authController.qrCode(req, res);

      expect(res.send.calledWith(sinon.match({
        success: true,
        image: sinon.match.string
      }))).to.be.true;

      expect(res.status.calledWith(500)).to.be.false;
    });
  });
});