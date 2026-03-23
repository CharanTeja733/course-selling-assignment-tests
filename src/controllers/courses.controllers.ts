
import { createCourse, deleteCourseById, getAllCourses, getCourseById, getCourseByIdWithLessons, updateCourseById } from "../services/courses.services";
import { getTotalPurchasesForCourse } from "../services/purchase.services";
import { createCourseSchema, createLessonSchema, updateCourseSchema } from "../validations/request.validation";
import type { Request, Response } from "express";

export async function createCourseController(req: Request, res: Response) {
    const validationResult = createCourseSchema.safeParse(req.body);

    if(validationResult.error) {
        return res.status(400).json({error: validationResult.error.issues})
    }

    const course = await createCourse(validationResult.data, req.user!.id);
    return res.status(200).json(course);
}

export async function getAllCoursesController(req: Request, res: Response) {    
    const pageQuery = req.query.page;
    let page = (typeof pageQuery === 'string') 
    ? parseInt(pageQuery, 10) 
    : 1;

    const pageSizeQuery = req.query.page;
    let pageSize = (typeof pageSizeQuery === 'string') 
    ? parseInt(pageSizeQuery, 10) 
    : 10;

    const {courses, count} = await getAllCourses(page, pageSize);
    const totalPages = (count / pageSize);
    /* for passing test case i need to remove this response format
    {
        data: courses,
        total: totalPages,
        page: page,
        limit: pageSize
    }
    */
    return res.status(200).json(courses);
}

export async function getCourseByIdController(req: Request, res: Response) {
    const courseId = req.params.id as string;
    const {courses, lessons} = await getCourseByIdWithLessons(courseId);

    return res.status(200).json(courses);
}

export async function patchCourseController(req: Request, res: Response) {
    const validationResult = updateCourseSchema.safeParse(req.body);

    if(validationResult.error) {
        return res.status(400).json({error: validationResult.error.issues})
    }

    const courseDetails= validationResult.data;
    const courseId = req.params.id as string;
    const existingCourse = await getCourseById(courseId);

    if(!existingCourse) {
        return res.status(404).json({error: `Course with id ${courseId} doesnot exist`});
    }

    if(existingCourse.instructorId !== req.user!.id) {
        return res.status(403).json({error: 'you are unauthorized to modify these course'});
    }

    const updatedCourse = await updateCourseById(courseDetails, courseId);

    return res.status(200).json(updatedCourse);
}

export async function deleteCourseController(req: Request, res: Response) {
    const courseId = req.params.id as string;
    const existingCourse = await getCourseById(courseId);

    if(!existingCourse) {
        return res.status(404).json({error: `Course with id ${courseId} doesnot exist`});
    }

    if(existingCourse.instructorId !== req.user!.id) {
        return res.status(403).json({error: 'you are unauthorized to delete these course'});
    }

    await deleteCourseById(courseId);

    return res.status(200).json({message: 'Course deleted'});
}


//total revenue for course controller
export async function getTotalRevenueForCourseController(req: Request, res: Response) {
    const courseId = req.params.id as string;

    const existingCourse = await getCourseById(courseId);

    if(!existingCourse) {
        return res.status(404).json({error: `Course with id ${courseId} doesnot exist`});
    }

    if(existingCourse.instructorId !== req.user!.id) {
        return res.status(403).json({error: 'you are unauthorized to see revenue for these course'});
    }

    const totalPurchases = await getTotalPurchasesForCourse(courseId);

    const totalRevenue = totalPurchases*existingCourse.price;

    return res.status(200).json({
        totalPurchases,
        totalRevenue,
        price: existingCourse.price
    })
}    