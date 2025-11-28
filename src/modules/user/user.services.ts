import { RegisterUserDTO, } from "./dtos";
import UserRepository from "./user.repository";
import bcrypt from 'bcryptjs';
import { createLog } from "../logs/logsCreate";
import { AppError } from "../../core/errors/AppError";

class UserService {
    constructor(private userRepository: UserRepository) { }

    async registerUser(dto: RegisterUserDTO, ip: string) {
        const existing = await this.userRepository.findByEmail(dto.email);
        if (existing) {
           throw  new AppError("Email já está em uso.", 404);
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user = await this.userRepository.createUser({
            ...dto,
            password: hashedPassword,
        });

        return user;
    }

    async changePasswordService(userID: string, lastPassword: string, newPassword: string, ip: string) {
        const existingUser = await this.userRepository.findById(userID);

        if (!existingUser) {
            await createLog({ action: "trocar Senha pessoal", status: "Erro", message: "Cliente não existe.", ip: ip })
            throw new Error("Cliente não existe.");
        }

        const isPassword = await bcrypt.compare(lastPassword, existingUser.password);
        if (!isPassword) {
            await createLog({ action: "trocar Senha pessoal", status: "Erro", message: "Senha atual invalida, error em trocar a senha", ip: ip })
            throw new Error("Senha invalida");
        }


        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await createLog({ action: "trocar Senha pessoal", status: "Sucesso", message: "Senha trocada com sucesso", ip: ip })

        await this.userRepository.changeUserPassword(existingUser.id, hashedPassword);

        return

    }


    async changePasswordUsersService(userID: string, newPassword: string, ip: string) {
        const existingUser = await this.userRepository.findById(userID);

        console.log(existingUser, userID)
        if (!existingUser) {
            await createLog({ action: "trocar Senha de clientes", status: "Erro", message: "Cliente não existe.", ip: ip })
            throw new Error("Cliente não existe.");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await createLog({ action: "trocar Senha de clientes", status: "Erro", message: "troca de senha no painel adm feito com sucesso.", ip: ip })

        await this.userRepository.changeUserPassword(existingUser.id, hashedPassword);

        return

    }


}

export default UserService;