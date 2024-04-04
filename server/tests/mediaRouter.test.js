const sinon = require('sinon');
const { expect } = require('chai');
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

const Media = require('../models/media');
const mediaController = require('../controllers/mediaController');

describe('Media Router', () => {
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
      Media.createMedia.resolves({ id: 1, name: 'Media 1' });

      request(app)
        .post('/media')
        .send({ name: 'Media 1' })
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
      Media.getAllMedia.resolves([{ id: 1, name: 'Media 1' }]);

      request(app)
        .get('/media')
        .expect(200)
        .end((err, res) => {
          expect(res.body.length).to.equal(1);
          expect(Media.getAllMedia.calledOnce).to.be.true;
          done(err);
        });
    });
  });

  describe('getMediaById', () => {
    it('should retrieve media by ID', (done) => {
      Media.getMediaById.resolves({ id: 1, name: 'Media 1' });

      request(app)
        .get('/media/1')
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
      Media.updateMediaById.resolves({ message: 'Media updated successfully' });

      request(app)
        .put('/media/1')
        .send({ name: 'Updated Media' })
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
      Media.deleteMediaById.resolves();

      request(app)
        .delete('/media/1')
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('message', 'Media deleted successfully');
          expect(Media.deleteMediaById.calledOnce).to.be.true;
          done(err);
        });
    });
  });
});
