const { expect } = require('chai');
const sinon = require('sinon');
const Media = require('../models/media');

describe('Media model', function() {
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

  describe('createMedia', function() {
    it('should insert media into the database', async function() {
      const name = "Test Media";
      clientStub.query.resolves({ rows: [{ id: 1, name }] });

      const media = await Media.createMedia(poolStub, name);

      expect(media).to.have.property('id');
      expect(media).to.have.property('name', name);
      expect(clientStub.query.calledOnce).to.be.true;
    });
  });

  describe('getAllMedia', function() {
    it('should retrieve all media types', async function() {
      const mediaData = [
        { id: 1, name: 'Media 1' },
        { id: 2, name: 'Media 2' }
      ];
      clientStub.query.resolves({ rows: mediaData });

      const media = await Media.getAllMedia(poolStub);

      expect(media).to.deep.equal(mediaData);
      expect(media.length).to.equal(2);
      expect(media[0].name).to.equal('Media 1');
      expect(media[1].name).to.equal('Media 2');
      expect(clientStub.query.calledOnce).to.be.true;
    });
  });

  describe('getMediaById', function() {
    it('should retrieve a single media type by id', async function() {
      const mediaId = 1;
      const mediaData = { id: mediaId, name: 'Media 1' };
      clientStub.query.resolves({ rows: [mediaData] });

      const media = await Media.getMediaById(poolStub, mediaId);

      expect(media).to.deep.equal(mediaData);
      expect(media.id).to.equal(mediaId);
      expect(media.name).to.equal('Media 1');
      expect(clientStub.query.calledOnce).to.be.true;
    });
  });

  describe('updateMediaById', function() {
    it('should update a media type by id', async function() {
      const mediaId = 1;
      const newName = "Updated Media";
      clientStub.query.resolves({ rows: [{ id: mediaId, name: newName }] });

      const media = await Media.updateMediaById(poolStub, newName, mediaId);

      expect(media).to.have.property('id', mediaId);
      expect(media).to.have.property('name', newName);
      expect(clientStub.query.calledOnce).to.be.true;
    });
  });

  describe('deleteMediaById', function() {
    it('should delete a media type by id', async function() {
      const mediaId = 1;
      clientStub.query.onFirstCall().resolves();  // First delete (campaign_mediatypes)
      clientStub.query.onSecondCall().resolves();  // Second delete (mediatypes)

      const result = await Media.deleteMediaById(poolStub, mediaId);

      expect(result).to.be.true;
      expect(clientStub.query.calledTwice).to.be.true; // Should be called twice for the two deletes
    });
  });
});
