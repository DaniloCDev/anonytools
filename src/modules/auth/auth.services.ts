import { UserLoginDTO, toUserResponseDTO } from "./dtos";
import UserRepository from "./auth.respository";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createLog } from "../logs/logsCreate";
import { AppError } from "../../core/errors/AppError";

class AuthUserService {
    constructor(private userRepository: UserRepository) { }


    async LoginUser(data: UserLoginDTO) {
        const existingUser = await this.userRepository.findByEmail(data.email);

        if (!existingUser) {
            throw new AppError("Email não existe.", 404);
        }
        if (existingUser.blocked) {
            throw new AppError("Usuário Bloqueado, procurar o suporte.", 403);
        }
        const isPassword = await bcrypt.compare(data.password, existingUser.password);
        if (!isPassword) {
            throw new AppError("Senha inválida.", 401);
        }

        return existingUser;
    }

    async LoginUserAdmin(data: { email: string, password: string }, ip: string) {
        const existingUser = await this.userRepository.findByEmail(data.email);


        if (!existingUser) {
            await createLog({ email: data.email, action: "LoginAdm", status: "Erro", message: "Email ou senha inválidos..", ip: ip })
            throw new AppError("Email ou senha inválidos.", 404);
        }
        const isPasswordValid = await bcrypt.compare(data.password, existingUser.password);
        if (!isPasswordValid) {
            await createLog({ email: data.email, action: "LoginAdm", status: "Erro", message: "Senha inválida..", ip: ip })
            throw new AppError("Senha inválida.", 401);
        }

        if (!existingUser.isAdmin) {
            await createLog({ email: existingUser.email, action: "LoginAdm", status: "Erro", message: "Acesso negado: usuário não é administrador.", ip: ip })
            throw new AppError("Acesso negado: usuário não é administrador.", 403);
        }

        const token = jwt.sign(
            { id: existingUser.id },
            process.env.JWT_SECRET_KEY as string,
            { expiresIn: '1d' }
        );
        await createLog({ email: existingUser.email, action: "LoginAdm", status: "Sucesso", message: "Acesso realizado.", ip: ip })

        return { user: toUserResponseDTO(existingUser), token };
    }

}

export default AuthUserService;