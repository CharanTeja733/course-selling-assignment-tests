import  express  from "express";
import { createLessonController } from "../controllers/lessons.controllers";
import { requireRole } from "../middlewares/authorization.middlewares";

const router = express.Router();
// 
router.use(requireRole('INSTRUCTOR'));
router.post('/', createLessonController);

export default router;