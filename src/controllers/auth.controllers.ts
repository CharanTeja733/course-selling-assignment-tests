import { signupSchema, loginSchema } from "../validations/request.validation";
import { generateHashedPassword, comparePassword } from "../utils/hash";
import { getUserByEmail, createUser } from "../services/users.services";
import { createUserToken } from "../utils/token";
import type { Request, Response } from "express";

export async function signupUser(
    req: Request,
    res: Response
) {
    
    const validationResult = await signupSchema.safeParseAsync(req.body);

    if(validationResult.error) {
        return res.status(400).json({message: validationResult.error.format()});
    }

    const {name, role, email, password} = validationResult.data;
    
    const existingUser = await getUserByEmail(email);
    
    if(existingUser) {
        return res.status(400).json({error: `user with email id ${email} already exist`});
    }

    const hashedPassword = await generateHashedPassword(password);

    const user = {
        name,
        role,
        email,
        password: hashedPassword
    };

    const createdUser = await createUser(user);

    return res.status(200).json({user: createdUser});
}

export async function loginUser(
    req: Request,
    res: Response
) {
    const validationResult = await loginSchema.safeParseAsync(req.body);

    if(validationResult.error) {
        return res.status(400).json({error: validationResult.error.format});
    }

    const {email, password} = validationResult.data;

    const user = await getUserByEmail(email);
    
    if(!user) {
        return res.status(401).json({error: `user with email id ${email} does not exist`});
    }

    const isPasswordCorrect = await comparePassword(password, user.password);
    
    if(!isPasswordCorrect) {
        return res.status(401).json({error: `password is not correct`});
    }

    const payload = {
       role: user.role,
       id: user.id,
       email: user.email
    }

    const token = createUserToken(payload);
    return res.status(200).json({token});
}

