import express from 'express';
import { Order } from 'models';
// Setup routes with express

const apiRoutes = express.Router();

/**
  Add a new order
  Params : an object {
    articleId,
    name,
    quantity,
    price,
    userId
  }
  All field are required
*/
apiRoutes.post('/', (req, res, next) => {
  // Need all field for create next entry
  console.log('_INFO_ : Attempt to add a new order');
  const { articleId, name, quantity, price, userId } = req.body;
  if (!articleId || !name || !quantity || !price || !userId) {
    throw new Error('Missing one or several parameters');
  }
  return Order.create({
    articleId,
    name,
    quantity,
    price,
    userId,
  })
    .then(order => {
      return res.status(200).send({
        success : true,
        msg     : 'Order created',
        order,
      });
    })
    .catch(next);
});

/**
 * Update an order
 * Params : an object with one or several fields following (quantity,price)
 */
apiRoutes.put('/', (req, res, next) => {
  console.log('_INFO_ : Attempt to update an order');
  const { articleId, userId, quantity } = req.body;
  if (!articleId || !userId) {
    throw new Error('Missing articleId or/and userId');
  }
  if (!quantity) {
    throw new Error('Missing quantity');
  }
  return Order.update(
    { quantity },
    {
      where : {
        $and : { userId, articleId },
      },
      returning : true,
    }
  )
    .then(order =>
      res.status(200).send({
        success : true,
        msg     : 'Order updated',
        order,
      })
    )
    .catch(next);
});

/**
 * Delete an article from an order
 * Params : articleId and userId required
 */
apiRoutes.delete('/article', (req, res, next) => {
  console.log('_INFO_ : Attempt to delete an article from an order');
  const { userId, articleId } = req.body;
  if (!userId && !articleId) {
    throw new Error('Missing parameters');
  }
  return Order.destroy({
    where : {
      $and : { userId, articleId },
    },
  })
    .then(() =>
      res.status(200).send({
        success : true,
        msg     : 'Article deleted',
      })
    )
    .catch(next);
});

/**
 * Delete an order
 * Params : userId
 */
apiRoutes.delete('/', (req, res, next) => {
  console.log('_INFO_ : Attempt to delete an order');
  const { userId } = req.body;
  if (!userId) {
    throw new Error('Missing userId');
  }
  return Order.destroy({
    where : {
      userId,
    },
  })
    .then(() =>
      res.status(200).send({
        success : true,
        msg     : 'Order deleted',
      })
    )
    .catch(next);
});

/**
 * Get an order by userId
 * Params : userId
 */
apiRoutes.get('/:userId', (req, res, next) => {
  console.log('_INFO_ : Attempt to get an order by userId');
  const { userId } = req.params;
  if (!userId) {
    throw new Error('Missing userId');
  }
  return Order.findAll({
    where : {
      userId,
    },
  })
    .then(articles =>
      res.status(200).send({
        success : true,
        msg     : 'Got articles from an order by userId',
        articles,
      })
    )
    .catch(next);
});

/**
 * Get an article from an order by userId an articleId
 * Params : articleId and userId
 */
apiRoutes.get('/:userId/:articleId', (req, res, next) => {
  console.log('_INFO_ : Attempt to get an article');
  const { userId, articleId } = req.params;
  if (!userId) {
    throw new Error('Missing userId');
  }
  if (!articleId) {
    throw new Error('Missing articleId');
  }
  return Order.findOne({
    where : {
      userId,
      articleId,
    },
  })
    .then(article =>
      res.status(200).send({
        success : true,
        msg     : 'Got article',
        article,
      })
    )
    .catch(next);
});
export default apiRoutes;
