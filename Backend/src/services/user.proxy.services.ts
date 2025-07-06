import { mapSubUserDtoToProxyUser, ProxyUser, SubUserDTO } from "../dtos/mappers/touseproxy.response.dto";
import { addToBalance } from "../external/dataimpulse/addTrafficInToBalance";
import { createSubUser } from "../external/dataimpulse/createSubUser";
import UserRepository from "../repository/user.repository";

class ProxyUserService {
    constructor(private userRepository: UserRepository) { }

    async createUserProxy(user_id: string) {

        if (!user_id) throw new Error("Usuario não esta logado");

        const existing = await this.userRepository.findById(user_id);
        if (!existing) {
            throw new Error("Usuario nâo existe");
        }

        const existingUserProxy = await this.userRepository.findProxyUserByUserId(user_id);
        if (existingUserProxy) {
            throw new Error("Já existe um usuario de proxy para este usuario");
        }

        let result: SubUserDTO = await createSubUser(existing.name);

        const proxyUser: ProxyUser = mapSubUserDtoToProxyUser(result);

        const user = await this.userRepository.createUserProxy({
            userId: existing.id,
            username: proxyUser.login,
            password: proxyUser.password,
            subuserId: proxyUser.userId.toString(),
        });

        return user;
    }

    async addTrafficInToBalance(user_id: string, saldo:number) {

        if (!user_id) throw new Error("Usuario não esta logado");

        const existing = await this.userRepository.findById(user_id);
        if (!existing) {
            throw new Error("Usuario nâo existe");
        }

        const existingUserProxy = await this.userRepository.findProxyUserByUserId(user_id);
        if (!existingUserProxy) {
            throw new Error("è nescessario criar um usuario de proxy");
        }

        let result = await addToBalance(Number(existingUserProxy.subuserId), saldo);

        if(!result.success) throw new Error("Error ao adicionar saldo");

       // const user = await this.userRepository.createUserProxy();

        return result;
    }
    async searchInfoUser(user_id: string) {

        if (!user_id) throw new Error("Usuario não esta logado");

        const existing = await this.userRepository.getDashboardData(user_id);
        if (!existing) {
            throw new Error("Usuario nâo existe");
        }

        console.log(existing)
        return existing;
    }
}

export default ProxyUserService;