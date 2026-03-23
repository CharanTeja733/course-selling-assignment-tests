import {z} from 'zod';

const roleSchema = z.enum(['STUDENT', 'INSTRUCTOR']);

export type  Role = z.infer<typeof roleSchema>;

export const signupSchema = z.object({
    email: z.email().trim(),
    password: z.string().min(6),
    name: z.string().trim(),
    role: z.string().trim().uppercase().pipe(roleSchema)
});

export const loginSchema = z.object({
    email: z.email().trim(),
    password: z.string().min(3)
})

export const createCourseSchema = z.object({
    title: z.string().trim(),
    description: z.string().trim(),
    price: z.number().int('price must be integer')
})

export const createLessonSchema = z.object({
    title: z.string().trim(),
    content: z.string().trim(),
    courseId: z.string().trim()
})    

export const purchaseCourseSchema = z.object({
    courseId: z.string().trim()
})


export const updateCourseSchema = z.object({
    title: z.string().trim().optional(),
    description: z.string().trim().optional(),
    price: z.number().int('price must be integer').optional()
})


export type Course = z.infer<typeof createCourseSchema>;
export type Lesson = z.infer<typeof createLessonSchema>;
export type UpdateCourse = z.infer<typeof updateCourseSchema>;