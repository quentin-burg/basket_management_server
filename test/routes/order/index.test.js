//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

import { Order } from '../../../src/models';

//Require the dev-dependencies

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../src/index');
const assert = require('assert');

chai.use(chaiHttp);

let ser;

//Our parent block
describe('Bill', () => {
  function emptyDb() {
    return Order.destroy({
      where    : {},
      truncate : true,
    });
  }

  before(done => {
    emptyDb().then(done());
  });

  beforeEach(done => {
    ser = chai.request(server);
    done();
  });

  afterEach(done => {
    //after each test we empty the database
    emptyDb().then(done());
  });

  /**
   *
   * Test the /GET route
   */
  describe('/GET orders by userID', () => {
    it('id found, it should return code 200', done => {
      Order.create({
        articleId : 1,
        name      : 'test1',
        quantity  : 2,
        price     : 10.0,
        userId    : 'bd74c8da-4d9e-11e7-b114-b2f933d5fe66',
      }).then(order => {
        const newBill = order.get({ plain : true });
        const id = newBill.userId;
        ser.get('/order/' + id).end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.articles[0].articleId, 1);
          done();
        });
      });
    });

    it('id found multiple articles, it should return code 200', done => {
      Order.create({
        articleId : 2,
        name      : 'test2',
        quantity  : 5,
        price     : 16.0,
        userId    : 'bd74c8da-4d9e-11e7-b114-b2f933d5fe66',
      }).then(
        Order.create({
          articleId : 1,
          name      : 'test1',
          quantity  : 2,
          price     : 10.0,
          userId    : 'bd74c8da-4d9e-11e7-b114-b2f933d5fe66',
        }).then(order => {
          const newBill = order.get({ plain : true });
          const id = newBill.userId;
          ser.get('/order/' + id).end((err, res) => {
            assert.equal(res.status, 200);
            assert(
              res.body.articles[0].articleId === 2 ||
                res.body.articles[0].articleId === 1
            );

            assert(
              res.body.articles[1].articleId === 2 ||
                res.body.articles[1].articleId === 1
            );

            assert(
              res.body.articles[1].articleId !== res.body.articles[0].articleId
            );
            done();
          });
        })
      );
    });

    it('id not found, it should return code 404', done => {
      ser.get('/order/bd74c8da-4d9e-11e7-b114-b2f933d5fe66').end((err, res) => {
        assert.equal(res.status, 404);
        done();
      });
    });
  });

  describe('GET order article', () => {
    it('ids ok, article found = code 200 + article', done => {
      Order.create({
        articleId : 2,
        name      : 'test2',
        quantity  : 5,
        price     : 16.0,
        userId    : 'bd74c8da-4d9e-11e7-b114-b2f933d5fe66',
      }).then(
        Order.create({
          articleId : 1,
          name      : 'test1',
          quantity  : 2,
          price     : 10.0,
          userId    : 'bd74c8da-4d9e-11e7-b114-b2f933d5fe66',
        }).then(() => {
          ser
            .get('/order/bd74c8da-4d9e-11e7-b114-b2f933d5fe66/2')
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.body.article.articleId, 2);
              done();
            });
        })
      );
    });
    it('id/article not found, it should return code 404', done => {
      ser
        .get('/order/bd74c8da-4d9e-11e7-b114-b2f933d5fe66/1')
        .end((err, res) => {
          assert.equal(res.status, 404);
          done();
        });
    });
  });
  describe('DELETE order', () => {
    it('ids ok, article deleted = code 200 + no article found', done => {
      Order.create({
        articleId : 2,
        name      : 'test2',
        quantity  : 5,
        price     : 16.0,
        userId    : 'bd74c8da-4d9e-11e7-b114-b2f933d5fe66',
      }).then(
        Order.create({
          articleId : 1,
          name      : 'test1',
          quantity  : 2,
          price     : 10.0,
          userId    : 'bd74c8da-4d9e-11e7-b114-b2f933d5fe66',
        }).then(() => {
          ser
            .delete('/order/')
            .send({ userId : 'bd74c8da-4d9e-11e7-b114-b2f933d5fe66' })
            .end((err, res) => {
              assert.equal(res.status, 200);
              Order.findAll({
                where : {
                  userId : 'bd74c8da-4d9e-11e7-b114-b2f933d5fe66',
                },
              }).then(articles => {
                assert.equal(articles.length, 0);
              });
              done();
            });
        })
      );
    });
    it('id missing, it should return code 500', done => {
      ser.delete('/order').end((err, res) => {
        assert.equal(res.status, 500);
        done();
      });
    });
  });

  describe('DELETE order/article', () => {
    it('ids ok, article found = code 200 + article', done => {
      Order.create({
        articleId : 2,
        name      : 'test2',
        quantity  : 5,
        price     : 16.0,
        userId    : 'bd74c8da-4d9e-11e7-b114-b2f933d5fe66',
      }).then(
        Order.create({
          articleId : 1,
          name      : 'test1',
          quantity  : 2,
          price     : 10.0,
          userId    : 'bd74c8da-4d9e-11e7-b114-b2f933d5fe66',
        }).then(() => {
          ser
            .delete('/order/article/')
            .send({
              userId    : 'bd74c8da-4d9e-11e7-b114-b2f933d5fe66',
              articleId : 1,
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              Order.findAll({
                where : {},
              }).then(articles => {
                assert.equal(articles.length, 1);
                assert.equal(articles[0].articleId, 2);
                done();
              });
            });
        })
      );
    });
    it('articleId missing, it should return code 500', done => {
      ser
        .delete('/order/article/')
        .send({ userId : 'bd74c8da-4d9e-11e7-b114-b2f933d5fe66' })
        .end((err, res) => {
          assert.equal(res.status, 500);
          done();
        });
    });
    it('userID missing, it should return code 500', done => {
      ser
        .delete('/order/article/')
        .send({ articleID : 2 })
        .end((err, res) => {
          assert.equal(res.status, 500);
          done();
        });
    });
  });

  describe('/PUT order ', () => {
    it('id found, it should return code 200', done => {
      Order.create({
        articleId : 1,
        name      : 'test1',
        quantity  : 2,
        price     : 10.0,
        userId    : 'bd74c8da-4d9e-11e7-b114-b2f933d5fe66',
      }).then(order => {
        const newOrder = order.get({ plain : true });
        newOrder.quantity += 1;
        ser
          .put('/order/')
          .send({ articles : [newOrder] })
          .end((err, res) => {
            assert.equal(res.status, 200);
            Order.findOne({ where : {} }).then(orderFound => {
              assert.equal(orderFound.articleId, 1);
              assert.equal(orderFound.quantity, 3);
              done();
            });
          });
      });
    });

    it('articles missing, it should return code 500', done => {
      Order.create({
        articleId : 1,
        name      : 'test1',
        quantity  : 2,
        price     : 10.0,
        userId    : 'bd74c8da-4d9e-11e7-b114-b2f933d5fe66',
      }).then(order => {
        const newOrder = order.get({ plain : true });
        newOrder.userId = null;
        ser
          .put('/order/')
          .send(newOrder)
          .end((err, res) => {
            assert.equal(res.status, 500);
            done();
          });
      });
    });

    it('article userId missing, it should return code 500', done => {
      ser.put('/order/').end((err, res) => {
        assert.equal(res.status, 500);
        done();
      });
    });
  });

  describe('/POST order ', () => {
    it('Correct format inserted, it should return code 200 and article is added', done => {
      const order = {
        articleId : 1,
        name      : 'test1',
        quantity  : 2,
        price     : 10.0,
        userId    : 'bd74c8da-4d9e-11e7-b114-b2f933d5fe66',
      };
      ser
        .post('/order/')
        .send(order)
        .end((err, res) => {
          assert.equal(res.status, 200);
          Order.findOne({ where : {} }).then(orderFound => {
            assert.equal(orderFound.articleId, 1);
            assert.equal(orderFound.quantity, 2);
            assert.equal(orderFound.price, 10.0);
            assert.equal(
              orderFound.userId,
              'bd74c8da-4d9e-11e7-b114-b2f933d5fe66'
            );
            done();
          });
        });
    });

    it('userID missing, it should return code 500 and article won\'t be added', done => {
      const order = {
        articleId : 1,
        name      : 'test1',
        quantity  : 2,
        price     : 10.0,
      };

      ser
        .post('/order/')
        .send(order)
        .end((err, res) => {
          assert.equal(res.status, 500);
          Order.findAll({ where : {} }).then(orders => {
            assert.equal(orders.length, 0);
            done();
          });
        });
    });

    it('article missing, it should return code 500', done => {
      ser.post('/order/').end((err, res) => {
        assert.equal(res.status, 500);
        done();
      });
    });
  });
});
