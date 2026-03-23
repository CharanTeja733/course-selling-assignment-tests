import  express  from "express";
import {ensureAuthenticated} from '../middlewares/authentication.middlewares';
import { requireRole } from "../middlewares/authorization.middlewares";
import { createCourseController, deleteCourseController, getAllCoursesController, getCourseByIdController, getTotalRevenueForCourseController, patchCourseController } from "../controllers/courses.controllers";
import { getLessonsController } from "../controllers/lessons.controllers";

//need to add middlewares
const router = express.Router();

//public endpoints
router.get('/', getAllCoursesController);
router.get('/:id', getCourseByIdController);
router.get('/:courseId/lessons', getLessonsController);

//need to authenticated

router.use(ensureAuthenticated);
router.use(requireRole('INSTRUCTOR'));

router.get('/:id/stats', getTotalRevenueForCourseController);
router.post('/',   createCourseController);
router.patch('/:id', patchCourseController);
router.delete('/:id', deleteCourseController);


export default router;