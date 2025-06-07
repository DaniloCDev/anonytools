import { mapSubUserDtoToProxyUser, ProxyUser, SubUserDTO } from "../dtos/mappers/touseproxy.response.dto";
import { createSubUser } from "../external/dataimpulse/createSubUser";
import UserRepository from "../repository/user.repository";

class ProxyUserService {
    constructor(private userRepository: UserRepository) { }

    async createUserProxy(user_id: string) {
       
        if(!user_id) throw new Error("Usuario não esta logado");
        
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

}

export default ProxyUserService;