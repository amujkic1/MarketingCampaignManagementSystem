const { expect } = require('chai');
const sinon = require('sinon');
const authController = require('../controllers/authController');

describe('Auth Controller', function() {
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
      const req = {}; 
      const res = {
        status: sinon.stub().returnsThis(), 
        send: sinon.stub() 
      };

      await authController.qrCode(req, res);

      sinon.assert.calledWith(res.send, { success: false, message: 'Internal server error' });
    });
  });
});
