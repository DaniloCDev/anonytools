import { RegisterUserDTO, UserLoginDTO, toUserResponseDTO } from "../dtos";
import UserRepository from "../repository/user.repository";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ProxyUserService from "./user.proxy.services";

class AuthUserService {
    constructor(private userRepository: UserRepository) { }


    async registerUser(data: RegisterUserDTO) {
        const proxyService = new ProxyUserService(new UserRepository());

        const existing = await this.userRepository.findByEmail(data.email);
        if (existing) {
            throw new Error("Email já está em uso.");
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await this.userRepository.createUser({
            ...data,
            password: hashedPassword,
        });


        await proxyService.createUserProxy(user.id);



        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET_KEY as string,
            { expiresIn: '1d' }
        );
        return { user: toUserResponseDTO(user), token };

    }

    async LoginUser(data: UserLoginDTO) {
        const proxyService = new ProxyUserService(new UserRepository());
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (!existingUser) {
            throw new Error("Email não existe.");
        }

        const isPassword = await bcrypt.compare(data.password, existingUser.password);
        if (!isPassword) {
            throw new Error("Senha invalida");
        }

        await proxyService.createUserProxy(existingUser.id);


        const token = jwt.sign(
            { id: existingUser.id },
            process.env.JWT_SECRET_KEY as string,
            { expiresIn: '1d' }
        );

        return { user: toUserResponseDTO(existingUser), token };

    }

    async LoginUserAdmin(data: { email: string, password: string}) {
        const proxyService = new ProxyUserService(new UserRepository());
        const existingUser = await this.userRepository.findByEmail(data.email);

        if (!existingUser) {
            throw new Error("Email ou senha inválidos."); 
        }

        const isPasswordValid = await bcrypt.compare(data.password, existingUser.password);
        if (!isPasswordValid) {
            throw new Error("Email ou senha inválidos.");
        }

        if (!existingUser.isAdmin) {
            throw new Error("Acesso negado: usuário não é administrador.");
        }

        await proxyService.createUserProxy(existingUser.id);

        const token = jwt.sign(
            { id: existingUser.id },
            process.env.JWT_SECRET_KEY as string,
            { expiresIn: '1d' }
        );

        return { user: toUserResponseDTO(existingUser), token };
    }


    async changePasswordService(userID: string, lastPassword: string, newPassword: string) {
        const existingUser = await this.userRepository.findById(userID);

        if (!existingUser) {
            throw new Error("Cliente não existe.");
        }

        const isPassword = await bcrypt.compare(lastPassword, existingUser.password);
        if (!isPassword) {
            throw new Error("Senha invalida");
        }


        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await this.userRepository.changeUserPassword(existingUser.id, hashedPassword);

        return

    }


    async changePasswordUsersService(userID: string, newPassword: string) {
        const existingUser = await this.userRepository.findById(userID);

        console.log(existingUser, userID)
        if (!existingUser) {
            throw new Error("Cliente não existe.");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await this.userRepository.changeUserPassword(existingUser.id, hashedPassword);

        return

    }


}

export default AuthUserService;