const { expect } = require('chai');
const sinon = require('sinon');
const Channel = require('../models/channel');

describe('Channel model', function() {
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

  describe('createChannel', function() {
    it('should insert a channel into the database', async function() {
      const name = "Test Channel";
      clientStub.query.resolves({ rows: [{ id: 1, name }] });

      const channel = await Channel.createChannel(poolStub, name);

      expect(channel).to.have.property('id');
      expect(channel).to.have.property('name', name);
      expect(clientStub.query.calledOnce).to.be.true;
    });
  });

  describe('getChannels', function() {
    it('should retrieve all channels', async function() {
      clientStub.query.resolves({ rows: [{ id: 1, name: "Channel 1" }, { id: 2, name: "Channel 2" }] });

      const channels = await Channel.getChannels(poolStub);

      expect(channels).to.have.lengthOf(2);
      expect(channels[0]).to.have.property('name', 'Channel 1');
      expect(channels[1]).to.have.property('name', 'Channel 2');
      expect(clientStub.query.calledOnce).to.be.true;
    });
  });

  describe('getChannelById', function() {
    it('should retrieve a channel by id', async function() {
      const channelId = 1;
      clientStub.query.resolves({ rows: [{ id: channelId, name: "Channel 1" }] });

      const channel = await Channel.getChannelById(poolStub, channelId);

      expect(channel[0]).to.have.property('id', channelId);
      expect(channel[0]).to.have.property('name', 'Channel 1');
      expect(clientStub.query.calledOnce).to.be.true;
    });
  });

  describe('updateChannel', function() {
    it('should update a channel', async function() {
      const channelId = 1;
      const newName = "Updated Channel";
      clientStub.query.resolves({ rows: [{ id: channelId, name: newName }] });

      const channel = await Channel.updateChannel(poolStub, newName, channelId);

      expect(channel).to.have.property('id', channelId);
      expect(channel).to.have.property('name', newName);
      expect(clientStub.query.calledOnce).to.be.true;
    });
  });

  describe('deleteChannel', function() {
    it('should delete a channel', async function() {
      const channelId = 1;
      clientStub.query.resolves();  

      const result = await Channel.deleteChannel(poolStub, channelId);

      expect(result).to.be.true;
      
      expect(clientStub.query.calledTwice).to.be.true;
    });
  });
});
