const sinon = require('sinon');
const { expect } = require('chai');
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

const Channel = require('../models/channel');
const channelController = require('../controllers/channelController');

describe('ChannelController', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(bodyParser.json());
    app.post('/channel', channelController.createChannel);
    app.get('/channel', channelController.getChannels);
    app.get('/channel/:id', channelController.getChannelById);
    app.put('/channel/:id', channelController.updateChannel);
    app.delete('/channel/:id', channelController.deleteChannel);

    sinon.stub(Channel, 'createChannel');
    sinon.stub(Channel, 'getChannels');
    sinon.stub(Channel, 'getChannelById');
    sinon.stub(Channel, 'updateChannel');
    sinon.stub(Channel, 'deleteChannel');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('createChannel', () => {
    it('should create a channel', (done) => {
      const name = "Test Channel";
      Channel.createChannel.resolves({ id: 1, name });

      request(app)
        .post('/channel')
        .send({ name })
        .expect(201)
        .end((err, res) => {
          expect(res.body).to.have.property('message', 'Successfully added channel');
          expect(Channel.createChannel.calledOnce).to.be.true;
          done(err);
        });
    });
  });

  describe('getChannels', () => {
    it('should retrieve all channels', (done) => {
      Channel.getChannels.resolves([{ id: 1, name: 'Channel 1' }, { id: 2, name: 'Channel 2' }]);

      request(app)
        .get('/channel')
        .expect(200)
        .end((err, res) => {
          expect(res.body.length).to.equal(2);
          expect(Channel.getChannels.calledOnce).to.be.true;
          done(err);
        });
    });
  });

  describe('getChannelById', () => {
    it('should retrieve a single channel by ID', (done) => {
      const channelId = 1;
      Channel.getChannelById.resolves({ id: channelId, name: 'Channel 1' });

      request(app)
        .get(`/channel/${channelId}`)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('name', 'Channel 1');
          expect(Channel.getChannelById.calledOnce).to.be.true;
          done(err);
        });
    });
  });

  describe('updateChannel', () => {
    it('should update a channel', (done) => {
      const channelId = 1;
      const newName = "Updated Channel";
      Channel.updateChannel.resolves({ id: channelId, name: newName });

      request(app)
        .put(`/channel/${channelId}`)
        .send({ name: newName })
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('message', 'Updated channel');
          expect(Channel.updateChannel.calledOnce).to.be.true;
          done(err);
        });
    });
  });

  describe('deleteChannel', () => {
    it('should delete a channel', (done) => {
      const channelId = 1;
      Channel.deleteChannel.resolves();

      request(app)
        .delete(`/channel/${channelId}`)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('message', 'Successfully deleted channel');
          expect(Channel.deleteChannel.calledOnce).to.be.true;
          done(err);
        });
    });
  });
});
