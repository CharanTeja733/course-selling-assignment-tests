import {pgTable, uuid, varchar, text, timestamp, pgEnum, integer, primaryKey} from "drizzle-orm/pg-core";

export const userRoles = pgEnum('role', ['STUDENT', 'INSTRUCTOR']);

export const usersTable = pgTable('users', {
    id: uuid().primaryKey().defaultRandom(),
    email: varchar({length: 255}).notNull().unique(),
    name: varchar({length: 255}).notNull(),
    password: text().notNull(),
    role: userRoles('role').default('STUDENT').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const coursesTable = pgTable('courses', {
    id: uuid().primaryKey().defaultRandom(),
    title: text().notNull(),
    description: text(),
    price: integer().notNull(),
    instructorId: uuid().references(() => usersTable.id, {onDelete: 'cascade'}),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').$onUpdate(() => new Date())
})

export const lessonsTable = pgTable('lessons', {
    id: uuid().primaryKey().defaultRandom(),
    title: text().notNull(),
    content: text().notNull(),
    courseId: uuid().notNull().references(() => coursesTable.id, {onDelete: 'cascade'}),
    createdAt: timestamp('created_at').defaultNow().notNull()
})

export const purchasesTable = pgTable('purchases', {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => usersTable.id, {onDelete: 'set null'}),
    courseId: uuid('course_id').references(() => coursesTable.id, {onDelete: 'set null'}),
    createdAt: timestamp('create_at').defaultNow().notNull(),
}
)
