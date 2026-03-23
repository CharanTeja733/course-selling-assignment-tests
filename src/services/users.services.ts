import {eq} from 'drizzle-orm';
import db from '../db/index';
import { usersTable } from '../db/schema';
import type { Role } from '../validations/request.validation';

export async function getUserByEmail(email: string) {
    const [existingUser] = await db
    .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        role: usersTable.role,
        password: usersTable.password
    })
    .from(usersTable)
    .where(eq(usersTable.email, email))

    return existingUser;
}


type User = {
    name: string;
    role: Role;
    email: string;
    password: string;
};

    

export async function createUser(user: User) {
    const {name, email, password, role} = user;

    const [createdUser] = await db
        .insert(usersTable)
        .values({
            name,
            email,
            password,
            role
        })
        .returning({
            name: usersTable.name, 
            email: usersTable.email,
            role: usersTable.role,
            id: usersTable.id
        });

    return createdUser;    
}