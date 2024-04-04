const sinon = require('sinon');
const { expect } = require('chai');
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

const Campaign = require('../models/campaign');
const campaignController = require('../controllers/campaignController');

describe('CampaignController', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(bodyParser.json());
    app.post('/campaign', campaignController.createCampaign);
    app.get('/campaign', campaignController.getCampaigns);
    app.get('/campaign/:id', campaignController.getCampaignsById);
    app.put('/campaign/:id', campaignController.updateCampaign);
    app.delete('/campaign/:id', campaignController.deleteCampaign);

    sinon.stub(Campaign, 'createCampaign');
    sinon.stub(Campaign, 'getCampaigns');
    sinon.stub(Campaign, 'getCampaignsById');
    sinon.stub(Campaign, 'updateCampaign');
    sinon.stub(Campaign, 'deleteCampaign');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('createCampaign', () => {
    it('should create a campaign', (done) => {
      Campaign.createCampaign.resolves({ id: 1, name: 'Campaign 1' });

      request(app)
        .post('/campaign')
        .send({ name: 'Campaign 1', durationfrom: '2021-01-01', durationto: '2021-12-31', mediatypes: 'TV', channels: 'Channel 1' })
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('message', 'Successfully created campaign');
          expect(Campaign.createCampaign.calledOnce).to.be.true;
          done(err);
        });
    });
  });

  describe('getCampaigns', () => {
    it('should retrieve all campaigns', (done) => {
      Campaign.getCampaigns.resolves([{ id: 1, name: 'Campaign 1' }]);

      request(app)
        .get('/campaign')
        .expect(200)
        .end((err, res) => {
          expect(res.body.length).to.equal(1);
          expect(Campaign.getCampaigns.calledOnce).to.be.true;
          done(err);
        });
    });
  });

  describe('getCampaignsById', () => {
    it('should retrieve a campaign by ID', (done) => {
      Campaign.getCampaignsById.resolves({ id: 1, name: 'Campaign 1' });

      request(app)
        .get('/campaign/1')
        .expect(200)
        .end((err, res) => {
          expect(res.body.campaign).to.have.property('name', 'Campaign 1');
          expect(Campaign.getCampaignsById.calledOnce).to.be.true;
          done(err);
        });
    });
  });

  describe('updateCampaign', () => {
    it('should update a campaign', (done) => {
      Campaign.updateCampaign.resolves();

      request(app)
        .put('/campaign/1')
        .send({ name: 'Updated Campaign', duration: '6 months' })
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('message', 'Successfuly updated campaign');
          expect(Campaign.updateCampaign.calledOnce).to.be.true;
          done(err);
        });
    });
  });

  describe('deleteCampaign', () => {
    it('should delete a campaign', (done) => {
      Campaign.deleteCampaign.resolves();

      request(app)
        .delete('/campaign/1')
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('message', 'Campaign deleted successfully');
          expect(Campaign.deleteCampaign.calledOnce).to.be.true;
          done(err);
        });
    });
  });
});
