import { UserLoginDTO } from "./dtos/user.login.dto";
import authService from './auth.services'
import ProxyUserService from '../proxy/user.proxy.services'
import { createLog } from "../logs/logsCreate";
import jwt from 'jsonwebtoken';
import { UserLoginResponseDTO } from "./dtos";

export class AuthOrchestrator {
    constructor(
        private authService: authService,
        private proxyService: ProxyUserService,
        private logsService: typeof createLog
    ) { }

    async login(dto: UserLoginDTO, ip: string): Promise<UserLoginResponseDTO> {

        let user = await this.authService.LoginUser(dto);
        await this.proxyService.createUserProxy(user.id);

        await this.logsService({
            email: user.email,
            action: "login",
            status: "Sucesso",
            message: "login realizado",
            ip
        });

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET_KEY as string,
            { expiresIn: "1d" }
        );

        return { user, token };
    }

}
