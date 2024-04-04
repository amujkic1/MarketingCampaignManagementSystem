const sinon = require('sinon');
const { expect } = require('chai');
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

const superAdminController = require('../controllers/superAdminController');
const adminService = require("../services/adminService");
const companyService = require("../services/companyService");

describe('SuperAdminController', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(bodyParser.json());
    app.post('/company', superAdminController.createCompany);
    app.post('/admin', superAdminController.createAdmin);

    sinon.stub(adminService, 'createAdmin');
    sinon.stub(companyService, 'createCompany');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('createCompany', () => {
    it('should create a company', (done) => {
      companyService.createCompany.resolves();

      request(app)
        .post('/company')
        .send({ name: 'Test Company', username: 'testuser', logoUrl: 'http://logo.url' })
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('message', 'Company created successfully!');
          expect(companyService.createCompany.calledOnce).to.be.true;
          done(err);
        });
    });

    it('should handle errors during company creation', (done) => {
      companyService.createCompany.rejects(new Error('Database error'));

      request(app)
        .post('/company')
        .send({ name: 'Test Company', username: 'testuser', logoUrl: 'http://logo.url' })
        .expect(500)
        .end((err, res) => {
          expect(res.body).to.have.property('error', 'Internal server error');
          expect(companyService.createCompany.calledOnce).to.be.true;
          done(err);
        });
    });
  });

  describe('createAdmin', () => {
    it('should create an admin', (done) => {
      adminService.createAdmin.resolves();

      request(app)
        .post('/admin')
        .send({ username: 'admin', password: 'password', email: 'admin@test.com', phone: '1234567890' })
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('message', 'Admin created successfully!');
          expect(adminService.createAdmin.calledOnce).to.be.true;
          done(err);
        });
    });

    it('should handle errors during admin creation', (done) => {
      adminService.createAdmin.rejects(new Error('Database error'));

      request(app)
        .post('/admin')
        .send({ username: 'admin', password: 'password', email: 'admin@test.com', phone: '1234567890' })
        .expect(500)
        .end((err, res) => {
          expect(res.body).to.have.property('error', 'Internal server error');
          expect(adminService.createAdmin.calledOnce).to.be.true;
          done(err);
        });
    });
  });
});
