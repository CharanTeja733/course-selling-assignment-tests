import express from 'express';
import { requireRole } from '../middlewares/authorization.middlewares';
import { getAllCoursePurchasedByUserController, purchaseCourseControllers } from '../controllers/purchase.controllers';
const router = express.Router();

router.use(requireRole('STUDENT'));

// need to add controllers
router.post('/', purchaseCourseControllers);

router.get('/', getAllCoursePurchasedByUserController);

export default router;