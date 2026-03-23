import { purchasesTable } from "../db/schema";
import db from "../db/index";
import { eq, count, desc,and } from "drizzle-orm";

export async function purchaseCourse(courseId: string, userId: string) {
    
    const purchase = await db.transaction(async (tx) => {
        const [purchase] = await tx
            .insert(purchasesTable)
            .values({
                courseId,
                userId
            })
            .returning();

        return purchase;
    })

    return purchase;
}

export async function  getAllCoursePurchasedByUser(userId: string, page: number, pageSize: number) {
    const [totalResult] = await db
                .select({ count: count() })
                .from(purchasesTable)
                .where(eq(purchasesTable.userId, userId));
 
    const purchasedCourses = await db
        .select()
        .from(purchasesTable)
        .where(eq(purchasesTable.userId, userId))
        .orderBy(desc(purchasesTable.createdAt))
        .limit(pageSize)
        .offset((page - 1)*pageSize);

    return {purchasedCourses, count: totalResult.count};    
}

export async function getTotalPurchasesForCourse(courseId: string) {
    const [totalResult] = await db
                .select({ count: count() })
                .from(purchasesTable)
                .where(eq(purchasesTable.courseId, courseId));
 

    return totalResult.count;   
}

export async function getPurchase(courseId: string, userId: string) {
    const [purchase] = await db
        .select()
        .from(purchasesTable)
        .where(and(eq(purchasesTable.courseId, courseId), eq(purchasesTable.userId, userId)));

    return purchase;
}
