const jwt = require('jsonwebtoken');
const { expect } = require('chai');
const sinon = require('sinon');
const authMiddleware = require('../middleware/authMiddleware');
const JWT_SECRET = require('../config.js').JWT_SECRET;

describe('authMiddleware', function() {
  let mockReq, mockRes, nextSpy;

  beforeEach(function() {
    mockReq = {
      headers: {
        authorization: null
      }
    };
    mockRes = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };
    nextSpy = sinon.spy();
  });

  it('should call next() for a valid token', function() {
    const userPayload = { id: 1, username: 'testuser' };
    const token = jwt.sign(userPayload, JWT_SECRET);
    mockReq.headers.authorization = token;

    authMiddleware(mockReq, mockRes, nextSpy);

    expect(nextSpy.calledOnce).to.be.true;
    expect(mockReq).to.have.property('userData');
    expect(mockReq.userData).to.deep.include(userPayload);
  });

  it('should return 401 for an invalid token', function() {
    mockReq.headers.authorization = 'Bearer invalidtoken';

    authMiddleware(mockReq, mockRes, nextSpy);

    expect(mockRes.status.calledWith(401)).to.be.true;
    expect(mockRes.json.calledOnce).to.be.true;
    expect(mockRes.json.getCall(0).args[0]).to.deep.equal({
      message: 'Authorization failed'
    });
    expect(nextSpy.called).to.be.false;
  });

  it('should return 401 if no token is provided', function() {
    authMiddleware(mockReq, mockRes, nextSpy);
  
    expect(mockRes.status.calledWith(401)).to.be.true;
    expect(mockRes.json.calledOnce).to.be.true;
    expect(mockRes.json.getCall(0).args[0]).to.deep.equal({
      message: 'Authorization failed'
    });
    expect(nextSpy.called).to.be.false;
  });

  it('should return 401 if the token is expired', function() {
    const expiredToken = jwt.sign({ id: 1, username: 'testuser', exp: Math.floor(Date.now() / 1000) - 10 }, JWT_SECRET);
    mockReq.headers.authorization = expiredToken;
  
    authMiddleware(mockReq, mockRes, nextSpy);
  
    expect(mockRes.status.calledWith(401)).to.be.true;
    expect(mockRes.json.calledOnce).to.be.true;
    expect(mockRes.json.getCall(0).args[0]).to.deep.equal({
      message: 'Authorization failed'
    });
    expect(nextSpy.called).to.be.false;
  });
  
});
