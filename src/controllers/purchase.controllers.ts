import { purchaseCourseSchema } from "../validations/request.validation";
import type { Request, Response } from "express";
import { purchaseCourse, getAllCoursePurchasedByUser, getPurchase } from "../services/purchase.services";

export async function purchaseCourseControllers(req: Request, res: Response) {
    const validationResult = purchaseCourseSchema.safeParse(req.body);

    if(validationResult.error) {
       return res.status(400).json({error: validationResult.error.issues});
    }

    const { courseId } = validationResult.data;

    const userId = req.user!.id;

    const existingPurchase = await getPurchase(courseId, userId);

    if(existingPurchase) {
        return res.status(409).json({error: "ITEM_ALREADY_OWNED", message: "You already own this course."});
    }
   
    const purchase = await purchaseCourse(courseId, userId);

    return res.status(201).json({purchase});
}

export async function getAllCoursePurchasedByUserController(req: Request, res: Response) {
    const userId = req.params.id as string;

    const pageQuery = req.query.page;
    let page = (typeof pageQuery === 'string') 
    ? parseInt(pageQuery, 10) 
    : 1;

    const pageSizeQuery = req.query.page;
    let pageSize = (typeof pageSizeQuery === 'string') 
    ? parseInt(pageSizeQuery, 10) 
    : 10;

    const {purchasedCourses, count} = await getAllCoursePurchasedByUser(userId, page, pageSize);

    const totalPages = (count / pageSize);
    return res.status(200).json({
        data: purchasedCourses,
        total: totalPages,
        page: page,
        limit: pageSize
    });
}