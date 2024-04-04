const sinon = require('sinon');
const { expect } = require('chai');
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

const Channel = require('../models/channel');
const channelController = require('../controllers/channelController');

describe('Channel Router', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(bodyParser.json());
    app.post('/channel', channelController.createChannel);
    app.get('/channel', channelController.getChannels);
    app.get('/channel/:id', channelController.getChannelById);
    app.delete('/channel/:id', channelController.deleteChannel);
    app.put('/channel/:id', channelController.updateChannel);

    sinon.stub(Channel, 'createChannel');
    sinon.stub(Channel, 'getChannels');
    sinon.stub(Channel, 'getChannelById');
    sinon.stub(Channel, 'updateChannel');
    sinon.stub(Channel, 'deleteChannel');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('Create Channel', () => {
    it('should create a new channel', (done) => {
      Channel.createChannel.resolves({ id: 1, name: 'Channel 1' });

      request(app)
        .post('/channel')
        .send({ name: 'Channel 1' })
        .expect(201)
        .end((err, res) => {
          expect(res.body).to.have.property('message', 'Successfully added channel');
          expect(Channel.createChannel.calledOnce).to.be.true;
          done(err);
        });
    });
  });

  describe('Get Channels', () => {
    it('should retrieve all channels', (done) => {
      Channel.getChannels.resolves([{ id: 1, name: 'Channel 1' }]);

      request(app)
        .get('/channel')
        .expect(200)
        .end((err, res) => {
          expect(res.body.length).to.equal(1);
          expect(Channel.getChannels.calledOnce).to.be.true;
          done(err);
        });
    });
  });

  describe('Get Channel By ID', () => {
    it('should retrieve a channel by ID', (done) => {
      Channel.getChannelById.resolves({ id: 1, name: 'Channel 1' });

      request(app)
        .get('/channel/1')
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('name', 'Channel 1');
          expect(Channel.getChannelById.calledOnce).to.be.true;
          done(err);
        });
    });
  });

  describe('Update Channel', () => {
    it('should update a channel', (done) => {
      Channel.updateChannel.resolves({ message: 'Updated channel' });

      request(app)
        .put('/channel/1')
        .send({ name: 'Updated Channel' })
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('message', 'Updated channel');
          expect(Channel.updateChannel.calledOnce).to.be.true;
          done(err);
        });
    });
  });

  describe('Delete Channel', () => {
    it('should delete a channel', (done) => {
      Channel.deleteChannel.resolves({ message: 'Successfully deleted channel' });

      request(app)
        .delete('/channel/1')
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('message', 'Successfully deleted channel');
          expect(Channel.deleteChannel.calledOnce).to.be.true;
          done(err);
        });
    });
  });
});
