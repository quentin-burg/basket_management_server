//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

import { Bill } from '../../../src/models';

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
    return Bill.destroy({
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
  describe('/GET bill', () => {
    it('id found, it should return code 200', done => {
      const dateNew = new Date().toISOString();

      Bill.create({
        date   : dateNew,
        userId : 'bd74c8da-4d9e-11e7-b114-b2f933d5fe66',
      }).then(bill => {
        const newBill = bill.get({ plain : true });
        const id = newBill.userId;
        ser.get('/bill/' + id).end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.bills[0].date, dateNew);
          done();
        });
      });
    });

    it('id not found, it should return code 404', done => {
      ser.get('/bill/bd74c8da-4d9e-11e7-b114-b2f933d5fe66').end((err, res) => {
        assert.equal(res.status, 404);
        done();
      });
    });
  });

  //POST TODO
  describe('/post bill', () => {
    it('userId valid, returns code 200 and new bill exists with the entered id', done => {
      ser
        .post('/bill/')
        .send({ userId : 'bd74c8da-4d9e-11e7-b114-b2f933d5fe66' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          Bill.findAll({
            where : {},
          }).then(bills => {
            assert(bills[0]);
            assert(bills[0].userId === 'bd74c8da-4d9e-11e7-b114-b2f933d5fe66');
            done();
          });
        });
    });

    it('userId invalid, code 500 + no bill created', done => {
      ser
        .post('/bill/')
        .send({ userId : '5' })
        .end((err, res) => {
          assert.equal(res.status, 500);
          Bill.findAll({
            where : {},
          }).then(bills => {
            assert(!bills[0]);
            done();
          });
        });
    });

    it('missing userId, code 500 + no bill created', done => {
      ser.post('/bill/').end((err, res) => {
        assert.equal(res.status, 500);
        Bill.findAll({
          where : {},
        }).then(bills => {
          assert(!bills[0]);
          done();
        });
      });
    });
  });
});
