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
        date : dateNew,
      }).then(bill => {
        const newBill = bill.get({ plain : true });
        const id = newBill.id;
        ser.get('/bill/' + id).end((err, res) => {
          console.log(res);
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
    it('userId valid, ', done => {
      const dateNew = new Date().toISOString();
      ser.post('/bill/').send({userId:1}).end(
        (err, res, body) => {
          assert.equal(res.status, 200);
          Bill.findAll({
            where : {}
          }).then(bills => {
            assert(bills[0]);
            done();
          });
        }
      );
    });
  });
});
