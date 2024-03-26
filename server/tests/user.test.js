const { expect } = require('chai');
const sinon = require('sinon');
const User = require('../models/user');



describe('User model', function() {
  let poolStub, clientStub;

  beforeEach(() => {
    clientStub = {
      query: sinon.stub(),
      release: sinon.fake(),
    };
    poolStub = {
      connect: sinon.stub().resolves(clientStub),
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getAllUsers', function() {
    it('should return an array of User instances', async function() {
      clientStub.query.resolves({ rows: [{ id: 1, username: 'testuser', email: 'test@example.com', two_factor_enabled: false, two_factor_secret: null }] });

      const users = await User.getAllUsers(poolStub);
      expect(users).to.be.an('array').that.is.not.empty;
      users.forEach(user => {
        expect(user).to.be.an.instanceof(User);
      });
    });
  });

  describe('getUser', function() {
    it('should return a User instance if user is found', async function() {
      clientStub.query.resolves({
        rows: [{ id: 1, username: 'testuser', email: 'test@example.com', two_factor_enabled: false, two_factor_secret: null }],
      });

      const user = await User.getUser(poolStub, 'testuser', 'password');
      expect(user).to.be.an.instanceof(User);
      expect(user.username).to.equal('testuser');
    });

    it('should return null if user is not found', async function() {
      clientStub.query.resolves({ rows: [] });

      const user = await User.getUser(poolStub, 'nonexistent', 'password');
      expect(user).to.be.null;
    });
  });

  describe('updateUserSecret', function() {
    it('should update the user\'s two_factor_secret', async function() {
      const user = new User(poolStub, 1, 'testuser', 'test@example.com', false, null);
      clientStub.query.resolves({ rowCount: 1 });

      const result = await user.updateUserSecret('newsecret');
      expect(result).to.be.true;
    });
  });

  describe('enable2FA', function() {
    it('should enable two-factor authentication for the user', async function() {
      const user = new User(poolStub, 1, 'testuser', 'test@example.com', false, null);
      clientStub.query.resolves({ rowCount: 1 });

      const result = await user.enable2FA();
      expect(result).to.be.true;
      expect(user.two_factor_enabled).to.be.true;
    });
  });

});
