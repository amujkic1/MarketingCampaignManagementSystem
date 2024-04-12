const { expect } = require('chai');
const sinon = require('sinon');
const Company = require('../models/company');

describe('Company model', function() {
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

  describe('getAdminCompanies', function() {
    it('should retrieve all companies', async function() {
      const companiesData = [
        { id: 1, name: 'Company 1', logo: 'logo1.png', admin_user_id: 1 },
        { id: 2, name: 'Company 2', logo: 'logo2.png', admin_user_id: 2 }
      ];

      clientStub.query.resolves({ rows: companiesData });

      const companies = await Company.getAdminCompanies(poolStub);

      expect(companies).to.deep.equal(companiesData);
      expect(companies.length).to.equal(2);
      expect(companies[0].name).to.equal('Company 1');
      expect(companies[1].name).to.equal('Company 2');
      expect(clientStub.query.calledOnce).to.be.true;
    });
  });

});
