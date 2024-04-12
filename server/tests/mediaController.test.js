const sinon = require('sinon');
const { expect } = require('chai');
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

const mediaController = require('../controllers/mediaController');
const Media = require('../models/media');

describe('MediaController', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(bodyParser.json());
    app.post('/media', mediaController.createMedia);
    app.get('/media', mediaController.getAllMedia);
    app.get('/media/:id', mediaController.getMediaById);
    app.put('/media/:id', mediaController.updateMediaById);
    app.delete('/media/:id', mediaController.deleteMediaById);

    sinon.stub(Media, 'createMedia');
    sinon.stub(Media, 'getAllMedia');
    sinon.stub(Media, 'getMediaById');
    sinon.stub(Media, 'updateMediaById');
    sinon.stub(Media, 'deleteMediaById');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('createMedia', () => {
    it('should create media', (done) => {
      const name = "Test Media";
      Media.createMedia.resolves({ id: 1, name });

      request(app)
        .post('/media')
        .send({ name })
        .expect(201)
        .end((err, res) => {
          expect(res.body).to.have.property('message', 'Media created successfully');
          expect(Media.createMedia.calledOnce).to.be.true;
          done(err);
        });
    });
  });

  describe('getAllMedia', () => {
    it('should retrieve all media', (done) => {
      Media.getAllMedia.resolves([{ id: 1, name: 'Media 1' }, { id: 2, name: 'Media 2' }]);

      request(app)
        .get('/media')
        .expect(200)
        .end((err, res) => {
          expect(res.body.length).to.equal(2);
          expect(Media.getAllMedia.calledOnce).to.be.true;
          done(err);
        });
    });
  });

  describe('getMediaById', () => {
    it('should retrieve a single media by ID', (done) => {
      const mediaId = 1;
      Media.getMediaById.resolves({ id: mediaId, name: 'Media 1' });

      request(app)
        .get(`/media/${mediaId}`)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('name', 'Media 1');
          expect(Media.getMediaById.calledOnce).to.be.true;
          done(err);
        });
    });
  });

  describe('updateMediaById', () => {
    it('should update media', (done) => {
      const mediaId = 1;
      const name = "Updated Media";
      Media.updateMediaById.resolves({ id: mediaId, name });

      request(app)
        .put(`/media/${mediaId}`)
        .send({ name })
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('message', 'Media updated successfully');
          expect(Media.updateMediaById.calledOnce).to.be.true;
          done(err);
        });
    });
  });

  describe('deleteMediaById', () => {
    it('should delete media', (done) => {
      const mediaId = 1;
      Media.deleteMediaById.resolves();

      request(app)
        .delete(`/media/${mediaId}`)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('message', 'Media deleted successfully');
          expect(Media.deleteMediaById.calledOnce).to.be.true;
          done(err);
        });
    });
  });
});
