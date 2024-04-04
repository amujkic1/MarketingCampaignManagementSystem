const sinon = require('sinon');
const { expect } = require('chai');
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

const Company = require('../models/company');
const companyController = require('../controllers/companyController');

describe('Company Router', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(bodyParser.json());
    app.post('/admincompanies', companyController.findAdminsCompanies);

    sinon.stub(Company, 'getAdminCompanies');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('Find Admin Companies', () => {
    it('should retrieve admin companies', (done) => {
      Company.getAdminCompanies.resolves([{ id: 1, name: 'Company 1' }]);

      request(app)
        .post('/admincompanies')
        .expect(200)
        .end((err, res) => {
          expect(res.body.length).to.equal(1);
          expect(Company.getAdminCompanies.calledOnce).to.be.true;
          done(err);
        });
    });
  });
});
