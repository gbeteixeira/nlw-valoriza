import { getCustomRepository } from "typeorm";

import { UsersRepositories } from "../repositories/UserRepositories";
import { sign } from "jsonwebtoken";

import { compare } from "bcryptjs";




interface IAuthenticationRequest {
    email: string;
    password: string;
}

class AuthenticateUserService {

    async execute({ email, password }: IAuthenticationRequest) {
        const usersRepositories = getCustomRepository(UsersRepositories);

        // Verificar se o email existente
        const user = await usersRepositories.findOne({ 
            email
        });

        if(!user) {
            throw new Error("Email/Password incorrect");
        }

        // verificar se senha está correta
        const passwordMatch = await compare(password, user.password);

        if(!passwordMatch) {
            throw new Error("Email/Password incorrect");
        }

        // Gerar token
        const token = sign(
            {
                email: user.email,
            }, 
            "e43665b7ee4a6b0e9e68ff97908c35a8", 
            {
                subject : user.id,
                expiresIn: "1d" 
            }
        );

        return token;

    }
}

export { AuthenticateUserService };