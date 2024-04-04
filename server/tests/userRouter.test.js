const sinon = require('sinon');
const { expect } = require('chai');
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const userController = require('../controllers/userController');
const User = require('../models/user');

describe('User Router', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(bodyParser.json());

    app.post('/users', userController.createUser);
    app.get('/users', userController.getAllUsers);
    app.get('/users/:id', userController.getUserById);
    app.put('/users/:id', userController.updateUserById);
    app.delete('/users/:id', userController.deleteUserById);

    sinon.stub(User, 'createUser');
    sinon.stub(User, 'getAllUsers');
    sinon.stub(User, 'getUserById');
    sinon.stub(User, 'updateUserById');
    sinon.stub(User, 'deleteUserById');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('GET /users', () => {
    it('should get all users', (done) => {
      User.getAllUsers.resolves([{ id: 1, name: 'John Doe', email: 'john@example.com' }]);

      request(app)
        .get('/users')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an('array').that.deep.includes({ id: 1, name: 'John Doe', email: 'john@example.com' });
          done();
        });
    });
  });

  describe('GET /users/:id', () => {
    it('should get a user by id', (done) => {
      User.getUserById.resolves({ id: 1, name: 'John Doe', email: 'john@example.com' });

      request(app)
        .get('/users/1')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.deep.equal({ id: 1, name: 'John Doe', email: 'john@example.com' });
          done();
        });
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete a user by id', (done) => {
      User.deleteUserById.resolves({ message: 'User deleted successfully' });

      request(app)
        .delete('/users/1')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message', 'User deleted successfully');
          done();
        });
    });
  });

});
