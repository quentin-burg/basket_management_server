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
  describe('/GET order', () => {
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
    it('id not found, it should return code 404', done => {
      ser.get('/order/bd74c8da-4d9e-11e7-b114-b2f933d5fe66').end((err, res) => {
        console.log(res);
        assert.equal(res.status, 404);
        done();
      });
    });
  });
});
