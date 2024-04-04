const sinon = require('sinon');
const { expect } = require('chai');
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

const companyController = require('../controllers/companyController');
const Company = require('../models/company');

describe('CompanyController', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(bodyParser.json());
    app.get('/companies', companyController.findAdminsCompanies);

    sinon.stub(Company, 'getAdminCompanies');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('findAdminsCompanies', () => {
    it('should retrieve admin\'s companies', (done) => {
      const companiesData = [{ id: 1, name: 'Company 1' }, { id: 2, name: 'Company 2' }];
      Company.getAdminCompanies.resolves(companiesData);

      request(app)
        .get('/companies')
        .expect(200)
        .end((err, res) => {
          expect(res.body.length).to.equal(2);
          expect(res.body).to.deep.equal(companiesData);
          expect(Company.getAdminCompanies.calledOnce).to.be.true;
          done(err);
        });
    });

    it('should handle errors', (done) => {
      const errorMessage = 'Database error';
      Company.getAdminCompanies.rejects(new Error(errorMessage));

      request(app)
        .get('/companies')
        .expect(500)
        .end((err, res) => {
          expect(res.body).to.have.property('error', 'Internal server error');
          expect(Company.getAdminCompanies.calledOnce).to.be.true;
          done(err);
        });
    });
  });

  // Tests for uploadImage would go here once the function is implemented
});
