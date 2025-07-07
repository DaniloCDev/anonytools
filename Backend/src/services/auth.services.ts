import { RegisterUserDTO, UserLoginDTO, toUserResponseDTO } from "../dtos";
import UserRepository from "../repository/user.repository";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ProxyUserService from "./user.proxy.services";

class AuthUserService {
    constructor(private userRepository: UserRepository) { }


    async registerUser(data: RegisterUserDTO) {
        const existing = await this.userRepository.findByEmail(data.email);
        if (existing) {
            throw new Error("Email já está em uso.");
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await this.userRepository.createUser({
            ...data,
            password: hashedPassword,
        });

        return user;
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
}

export default AuthUserService;