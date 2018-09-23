import express from 'express';

import orderRoutes from 'routes/order';
import billRoutes from 'routes/bill';

// bundle our routes for API
const apiRoutes = express.Router();
apiRoutes.use('/order', orderRoutes);
apiRoutes.use('/bill', billRoutes);

export default apiRoutes;
