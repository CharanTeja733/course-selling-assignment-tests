import {eq, desc, count} from 'drizzle-orm';
import db from '../db/index';
import { coursesTable, lessonsTable } from '../db/schema';
import type { Course, Lesson, UpdateCourse } from '../validations/request.validation';

export async function createCourse(courseDetails: Course, instructorId: string) {
    const [course] = await db
        .insert(coursesTable)
        .values({
            ...courseDetails,
            instructorId
        })
        .returning();

    return course;    
}

export async function getAllCourses(page: number, pageSize: number) {
    const [totalResult] = await db
                .select({ count: count() })
                .from(coursesTable);

    
    const courses = await db
        .select()
        .from(coursesTable)
        .orderBy(desc(coursesTable.createdAt))
        .limit(pageSize)
        .offset((page - 1)*pageSize);
        

    return {courses, count: totalResult.count};    
}

export async function getCourseById(courseId: string) {
    const [course] = await db
        .select()
        .from(coursesTable)
        .where(eq(coursesTable.id, courseId));
    return course;    
}

export async function getCourseByIdWithLessons(courseId: string) {
    const [course] = await db
        .select()
        .from(coursesTable)
        .where(eq(coursesTable.id, courseId))
        .leftJoin(lessonsTable, eq(lessonsTable.courseId, courseId));

    return course;    
}

export async function getAllLessonForCourse(courseId: string) {
    const lessons = await db
        .select()
        .from(lessonsTable)
        .where(eq(lessonsTable.courseId, courseId))
        .orderBy(lessonsTable.createdAt);

    return lessons; 
}

export async function updateCourseById(courseDetails: UpdateCourse, courseId: string) {
    const [course] = await db
        .update(coursesTable)
        .set({
            ...courseDetails
        })
        .where(eq(coursesTable.id, courseId))
        .returning();

    return course;    
}
export async function deleteCourseById(courseId: string) {
    await db
        .delete(coursesTable)
        .where(eq(coursesTable.id, courseId));    
}

export async function addLessonForCourse(lessonDetails: Lesson) {
    
    const [lesson] = await db
        .insert(lessonsTable)
        .values(lessonDetails)
        .returning();

    return lesson;       
}
