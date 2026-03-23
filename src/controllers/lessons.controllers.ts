import type {Request, Response} from 'express';
import { createLessonSchema } from '../validations/request.validation';
import { addLessonForCourse, getAllLessonForCourse, getCourseById } from '../services/courses.services';

export async function createLessonController(req: Request, res: Response) {
    const validationResult = createLessonSchema.safeParse(req.body);
    
    if(validationResult.error) {
        return res.status(400).json({error: validationResult.error.issues});
    }

    const lessonDetails = validationResult.data;
    const courseId = lessonDetails.courseId;
    const existingCourse = await getCourseById(courseId);

    if(!existingCourse) {
        return res.status(404).json({error: `course with id ${courseId} doesnot exist`});
    }

    if(existingCourse.instructorId !== req.user!.id) {
        return res.status(403).json({error: 'your are unauthorized to add lessons to the course'});
    }
    
    const lesson = await addLessonForCourse(lessonDetails);

    return res.status(200).json(lesson);
}

export async function getLessonsController(req: Request, res: Response) {
    const courseId = req.params.courseId as string;
    
    const lessons = await getAllLessonForCourse(courseId);

    return res.status(200).json(lessons);
}