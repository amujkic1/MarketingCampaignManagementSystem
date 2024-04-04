const sinon = require('sinon');
const { expect } = require('chai');
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const superAdminController = require('../controllers/superAdminController');
const superAdminRouter = require('../routes/superAdminRouter');

describe('Super Admin Router', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(bodyParser.json());
    app.post("/company", superAdminController.createCompany);
    app.post("/admin", superAdminController.createAdmin);

    sinon.stub(superAdminController, 'createCompany');
    sinon.stub(superAdminController, 'createAdmin');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('POST /company', () => {
    it('should create a company', (done) => {
      superAdminController.createCompany.resolves({ message: 'Company created successfully!' });

      request(app)
        .post('/company')
        .send({ name: 'Test Company', username: 'testuser', logoUrl: 'http://example.com/logo.png' })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message', 'Company created successfully!');
          done();
        });
    });
  });

  describe('POST /admin', () => {
    it('should create an admin', (done) => {
      superAdminController.createAdmin.resolves({ message: 'Admin created successfully!' });
      request(app)
        .post('/admin')
        .send({ username: 'admin', password: 'admin123', email: 'admin@example.com', phone: '123456789' })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message', 'Admin created successfully!');
          done();
        });
    });
  });
});
