import { mapSubUserDtoToProxyUser, ProxyUser, SubUserDTO } from "../dtos/mappers/touseproxy.response.dto";
import { addToBalance } from "../external/dataimpulse/addTrafficInToBalance";
import { createSubUser } from "../external/dataimpulse/createSubUser";
import UserRepository from "../repository/user.repository";

function convertBigIntToString(obj: any): any {
  if (typeof obj === 'bigint') {
    return obj.toString();
  }

  if (Array.isArray(obj)) {
    return obj.map(convertBigIntToString);
  }

  if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, convertBigIntToString(value)])
    );
  }

  return obj;
}


class ProxyUserService {
    constructor(private userRepository: UserRepository) { }

    async createUserProxy(user_id: string) {

        if (!user_id) throw new Error("Usuario não esta logado");

        const existing = await this.userRepository.findById(user_id);
        if (!existing) {
            throw new Error("Usuario nâo existe");
        }

        const existingUserProxy = await this.userRepository.findProxyUserByUserId(user_id);
        if (!existingUserProxy) {
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
        return;
    }

    async addTrafficInToBalance(user_id: string, saldo: number) {
        if (!user_id) throw new Error("Usuário não está logado");

        const existing = await this.userRepository.findById(user_id);
        if (!existing) throw new Error("Usuário não existe");

        const existingUserProxy = await this.userRepository.findProxyUserByUserId(user_id);
        if (!existingUserProxy) throw new Error("É necessário criar um usuário de proxy");

        const result = await addToBalance(Number(existingUserProxy.subuserId), saldo);

        if (!result.success) throw new Error("Erro ao adicionar saldo");

        return result;
    }
    
    async searchInfoUser(user_id: string) {
        if (!user_id) throw new Error("Usuario não esta logado");

        const existing = await this.userRepository.getDashboardData(user_id);
        if (!existing) {
            throw new Error("Usuario nâo existe");
        }

    //    console.log(existing)
        return convertBigIntToString(existing);
    }
}

export default ProxyUserService;