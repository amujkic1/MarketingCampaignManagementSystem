const { expect } = require('chai');
const sinon = require('sinon');
const Campaign = require('../models/Campaign');

describe('Campaign model', function() {
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

  describe('createCampaign', function() {
    it('should insert a campaign into the database', async function() {
      clientStub.query.onCall(0).resolves({ rows: [{ id: 1 }] });
      clientStub.query.onCall(1).resolves({ rows: [{ id: 2 }] }); 
      clientStub.query.onCall(2).resolves({ rows: [{ id: 3, name: 'Test Campaign' }] }); 
  
      clientStub.query.onCall(3).resolves({ rows: [{ campaign_id: 3, channel_id: 1 }] });
      clientStub.query.onCall(4).resolves({ rows: [{ campaign_id: 3, mediatype_id: 2 }] });
  
      const campaign = await Campaign.createCampaign(poolStub, 'Test Campaign', '2023-01-01', '2023-12-31', 'Social Media', 'Facebook');
  
      expect(campaign).to.have.property('id', 3);
      expect(clientStub.query.callCount).to.equal(5); 
    });
  });
  
  

  describe('getCampaigns', function() {
    it('should retrieve all campaigns', async function() {
      clientStub.query.resolves({ rows: [{ id: 1, name: "Campaign 1" }, { id: 2, name: "Campaign 2" }] });

      const campaigns = await Campaign.getCampaigns(poolStub);

      expect(campaigns).to.have.lengthOf(2);
      expect(campaigns[0]).to.have.property('name', 'Campaign 1');
      expect(campaigns[1]).to.have.property('name', 'Campaign 2');
      expect(clientStub.query.calledOnce).to.be.true;
    });
  });

  describe('getCampaignsById', function() {
    it('should retrieve a campaign by id', async function() {
      const campaignId = 1;
      clientStub.query.resolves({ rows: [{ id: campaignId, name: "Campaign 1" }] });

      const campaign = await Campaign.getCampaignsById(poolStub, campaignId);

      expect(campaign[0]).to.have.property('id', campaignId);
      expect(campaign[0]).to.have.property('name', 'Campaign 1');
      expect(clientStub.query.calledOnce).to.be.true;
    });
  });

  describe('updateCampaign', function() {
    it('should update a campaign', async function() {
      const campaignId = 1;
      const newName = "Updated Campaign";
      clientStub.query.resolves({ rows: [{ id: campaignId, name: newName }] });

      const campaign = await Campaign.updateCampaign(poolStub, campaignId, newName, null);

      expect(campaign).to.have.property('id', campaignId);
      expect(campaign).to.have.property('name', newName);
      expect(clientStub.query.calledOnce).to.be.true;
    });
  });

  describe('deleteCampaign', function() {
    it('should delete a campaign', async function() {
      const campaignId = 1;
      clientStub.query.resolves({});

      const result = await Campaign.deleteCampaign(poolStub, campaignId);

      expect(result).to.be.true;
      expect(clientStub.query.calledThrice).to.be.true; 
    });
  });
});
