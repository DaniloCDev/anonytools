import { RegisterUserDTO, UserLoginDTO, toUserResponseDTO } from "../dtos";
import UserRepository from "../repository/user.repository";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ProxyUserService from "./user.proxy.services";
import { createLog } from "../repository/logsCreate";

class AuthUserService {
    constructor(private userRepository: UserRepository) { }


    async registerUser(data: RegisterUserDTO, ip: string) {
        const proxyService = new ProxyUserService(new UserRepository());

        const existing = await this.userRepository.findByEmail(data.email);
        if (existing) {
            await createLog({ email: existing.email, action: "register", status: "Erro", message: "tentando registrar com Email já em uso.", ip: ip })
            throw new Error("Email já está em uso.");

        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await this.userRepository.createUser({
            ...data,
            password: hashedPassword,
        });


        await proxyService.createUserProxy(user.id);


        await createLog({ email: user.email, action: "register", status: "Sucesso", message: "Registro realizado com sucesso.", ip: ip })

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET_KEY as string,
            { expiresIn: '1d' }
        );
        return { user: toUserResponseDTO(user), token };

    }

    async LoginUser(data: UserLoginDTO, ip: string) {
        const proxyService = new ProxyUserService(new UserRepository());
        const existingUser = await this.userRepository.findByEmail(data.email);

        if (!existingUser) {
            await createLog({ email: data.email, action: "login", status: "Erro", message: "Tentativa de login com email não registrado", ip: ip, })
            throw new Error("Email não existe.");
        }

        if (existingUser.blocked) {
            await createLog({ email: existingUser.email, action: "login", status: "Erro", message: "Tentativa de login com usuário bloqueado", ip: ip, })
            throw new Error("Usuário Bloqueado, procurar o suporte.");
        }

        const isPassword = await bcrypt.compare(data.password, existingUser.password);
        if (!isPassword) {
            await createLog({ email: data.email, action: "login", status: "Erro", message: "Tentativa de login com senha inválida", ip: ip, })
            throw new Error("Senha inválida.");
        }

        await proxyService.createUserProxy(existingUser.id);

        const token = jwt.sign(
            { id: existingUser.id },
            process.env.JWT_SECRET_KEY as string,
            { expiresIn: "1d" }
        );
        await createLog({ email: existingUser.email, action: "login", status: "Sucesso", message: "Login realizado com sucesso", ip: ip, })
        return { user: toUserResponseDTO(existingUser), token };
    }

    async LoginUserAdmin(data: { email: string, password: string }, ip: string) {
        const proxyService = new ProxyUserService(new UserRepository());
        const existingUser = await this.userRepository.findByEmail(data.email);


        if (!existingUser) {
            await createLog({ email: data.email, action: "LoginAdm", status: "Erro", message: "Email ou senha inválidos..", ip: ip })
            throw new Error("Email ou senha inválidos.");
        }
        const isPasswordValid = await bcrypt.compare(data.password, existingUser.password);
        if (!isPasswordValid) {
            await createLog({ email: data.email, action: "LoginAdm", status: "Erro", message: "Senha inválida..", ip: ip })
            throw new Error("Senha inválida.");
        }

        if (!existingUser.isAdmin) {
            await createLog({ email: existingUser.email, action: "LoginAdm", status: "Erro", message: "Acesso negado: usuário não é administrador.", ip: ip })
            throw new Error("Acesso negado: usuário não é administrador.");
        }

        await proxyService.createUserProxy(existingUser.id);

        const token = jwt.sign(
            { id: existingUser.id },
            process.env.JWT_SECRET_KEY as string,
            { expiresIn: '1d' }
        );
        await createLog({ email: existingUser.email, action: "LoginAdm", status: "Sucesso", message: "Acesso negado realizado.", ip: ip })

        return { user: toUserResponseDTO(existingUser), token };
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

export default AuthUserService;