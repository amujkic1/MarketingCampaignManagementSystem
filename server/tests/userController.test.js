const sinon = require('sinon');
const { expect } = require('chai');
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const userController = require('../controllers/userController');
const User = require('../models/user');

describe('UserController', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(bodyParser.json());
    app.post('/user', userController.createUser);
    app.get('/user', userController.getAllUsers);
    app.get('/user/:id', userController.getUserById);
    app.put('/user/:id', userController.updateUserById);
    app.delete('/user/:id', userController.deleteUserById);

    sinon.stub(User, 'createUser');
    sinon.stub(User, 'getAllUsers');
    sinon.stub(User, 'getUserById');
    sinon.stub(User, 'updateUserById');
    sinon.stub(User, 'deleteUserById');
    sinon.stub(bcrypt, 'hash').resolves('hashedPassword');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('createUser', () => {
    it('should create a user', (done) => {
      User.createUser.resolves({ id: 1, username: 'testuser', email: 'test@example.com' });

      request(app)
        .post('/user')
        .send({ username: 'testuser', password: 'password', email: 'test@example.com', phone: '1234567890' })
        .expect(201)
        .end((err, res) => {
          expect(res.body).to.have.property('message', 'User created successfully');
          expect(User.createUser.calledOnce).to.be.true;
          done(err);
        });
    });
  });

  describe('getAllUsers', () => {
    it('should retrieve all users', (done) => {
      User.getAllUsers.resolves([{ id: 1, username: 'testuser1' }, { id: 2, username: 'testuser2' }]);

      request(app)
        .get('/user')
        .expect(200)
        .end((err, res) => {
          expect(res.body.length).to.equal(2);
          expect(User.getAllUsers.calledOnce).to.be.true;
          done(err);
        });
    });
  });

  describe('getUserById', () => {
    it('should retrieve a single user by ID', (done) => {
      const userId = 1;
      User.getUserById.resolves({ id: userId, username: 'testuser' });

      request(app)
        .get(`/user/${userId}`)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('username', 'testuser');
          expect(User.getUserById.calledOnce).to.be.true;
          done(err);
        });
    });
  });

  describe('updateUserById', () => {
    it('should update a user', (done) => {
      const userId = 1;
      User.updateUserById.resolves({ id: userId, username: 'updatedUser' });

      request(app)
        .put(`/user/${userId}`)
        .send({ username: 'updatedUser', password: 'newpassword', email: 'updated@example.com', phone: '9876543210' })
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('message', 'User updated successfully');
          expect(User.updateUserById.calledOnce).to.be.true;
          done(err);
        });
    });
  });

  describe('deleteUserById', () => {
    it('should delete a user', (done) => {
      const userId = 1;
      User.deleteUserById.resolves();

      request(app)
        .delete(`/user/${userId}`)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('message', 'User deleted successfully');
          expect(User.deleteUserById.calledOnce).to.be.true;
          done(err);
        });
    });
  });
});
