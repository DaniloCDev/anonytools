import { RegisterUserDTO } from "./dtos/user.register.dto";
import UserService from './user.services'
import ProxyUserService from '../proxy/user.proxy.services'
import { createLog } from "../logs/logsCreate";
import jwt from 'jsonwebtoken';

export class UserOrchestrator {
  constructor(
    private userService: UserService,
    private proxyService: ProxyUserService,
    private logsService: typeof createLog
  ) { }

  async registerUser(dto: RegisterUserDTO, ip: string) {

    const user = await this.userService.registerUser(dto, ip);

    try {
      await this.proxyService.createUserProxy(user.id);

    } catch (err) {
      /// await this.userService.markProxyPending(user.id);
      await this.logsService({ email: user.email, action: "register", status: "Erro", message: "Proxy creation failed", ip });

    }
    await this.logsService({ email: user.email, action: "register", status: "Sucesso", message: "Registro realizado", ip });

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "1d" }
    );

    return { user, token };
  }
}
