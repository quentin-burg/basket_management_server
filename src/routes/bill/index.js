import express from 'express';
import { Bill } from 'models';
// Setup routes with express

const apiRoutes = express.Router();

/**
 * Create a new bill
 */
apiRoutes.post('/', (req, res, next) => {
  console.log('_INFO_ : Attempt to create a new bill');
  const { orderId } = req.body;
  if (!orderId) {
    throw new Error('OrderId is missing');
  }
  return Bill.create({
    orderId,
    date : new Date().toISOString(),
  })
    .then(bill =>
      res.status(200).send({
        success : true,
        msg     : 'Bill created',
        bill,
      })
    )
    .catch(next);
});

/**
 * Get bills by orderId
 * Params: orderId
 */
apiRoutes.get('/:inputId', (req, res, next) => {
  console.log('_INFO_ : Attempt to get bills by order');
  const { inputId } = req.params;
  if (!inputId) {
    throw new Error('Missing orderId');
  }
  return Bill.findAll({
    where : {
      id : inputId,
    },
  })
    .then(bills =>
      res.status(200).send({
        success : true,
        msg     : 'Got bills by orderId',
        bills,
      })
    )
    .catch(next);
});
export default apiRoutes;
