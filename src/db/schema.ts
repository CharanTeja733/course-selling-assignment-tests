import {pgTable, uuid, varchar, text, timestamp, pgEnum, integer} from "drizzle-orm/pg-core";

export const userRoles = pgEnum('role', ['STUDENT', 'INSTRUCTOR']);

export const usersTable = pgTable('users', {
    id: uuid().primaryKey().defaultRandom(),
    email: varchar({length: 255}).notNull().unique(),
    name: varchar({length: 255}).notNull(),
    
    salt: text().notNull(),
    password: text().notNull(),

    role: userRoles('role').default('INSTRUCTOR').notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const coursesTable = pgTable('courses', {
    id: uuid().primaryKey().defaultRandom(),
    title: text().notNull(),
    description: text(),
    price: integer().notNull(),
    instructorId: uuid().references(() => usersTable.id),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').$onUpdate(() => new Date())
})

export const lessonsTable = pgTable('lessons', {
    id: uuid().primaryKey().defaultRandom(),
    title: text().notNull(),
    content: text().notNull(),
    courseId: uuid().notNull().references(() => coursesTable.id),
    createdAt: timestamp('created_at').defaultNow().notNull()
})

export const purchasesTable = pgTable('purchases', {
    id: uuid().primaryKey(),
    userId: uuid('user_id').references(() => usersTable.id),
    courseId: uuid('course_id').references(() => coursesTable.id),
    createdAt: timestamp('create_at').defaultNow().notNull()
})
