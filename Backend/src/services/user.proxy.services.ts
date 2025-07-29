import { mapSubUserDtoToProxyUser, ProxyUser, SubUserDTO } from "../dtos/mappers/touseproxy.response.dto";
import { addToBalance } from "../external/dataimpulse/addTrafficInToBalance";
import { changePasswordExternalApi } from "../external/dataimpulse/changePassword";
import { createSubUser } from "../external/dataimpulse/createSubUser";
import { getBalanceUser } from "../external/dataimpulse/getBalanceSubUser";
import { getUser } from "../external/dataimpulse/getUser";
import { changeProxyThreads } from "../external/dataimpulse/updateProxyThreads";
import UserRepository from "../repository/user.repository";
import serializeBigIntAndDate from "../utils/serializeBigInt";

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

    async getUserBalanceService(userId: string) {
        const user = await this.userRepository.findById(userId)
        if (!user) throw new Error("Usuário não encontrado.")

        const descUser = await this.userRepository.getSubuserIdByUserId(userId)
        let respBalance = await getBalanceUser(Number(descUser?.subuserId));
        //  console.log(respBalance)
        return respBalance
    }


    async deleteUser(userId: string) {
        const user = await this.userRepository.findById(userId)
        if (!user) throw new Error("Usuário não encontrado.");

        const descUser = await this.userRepository.getSubuserIdByUserId(userId)
        await this.userRepository.deleteUser(user.email)
        let respBalance = await getBalanceUser(Number(descUser?.subuserId));
        if (!respBalance.success) throw new Error("Usuario não pode ser deletado");
        
        return respBalance.success;
    }

    async getUserService(userId: string) {
        const user = await this.userRepository.findById(userId)
        if (!user) throw new Error("Usuário não encontrado.")

        const descUser = await this.userRepository.getSubuserIdByUserId(userId)
        let respBalance = await getUser(Number(descUser?.subuserId));
        console.log(respBalance)
        return respBalance.threads;
    }

    async changePasswordService(userId: string) {
        const user = await this.userRepository.findById(userId)
        if (!user) throw new Error("Usuário não encontrado.")

        const descUser = await this.userRepository.getSubuserIdByUserId(userId)
        let respResetPassword = await changePasswordExternalApi(Number(descUser?.subuserId));
        await this.userRepository.resetPasswordProxy(userId, respResetPassword.password)
        console.log(respResetPassword.password)
        return respResetPassword.password
    }


    async updateProxyThreadsService(userId: string, threads: number) {
        const user = await this.userRepository.findById(userId)
        if (!user) throw new Error("Usuário não encontrado.")

        const descUser = await this.userRepository.getSubuserIdByUserId(userId)
        let updatedThreads = await changeProxyThreads(Number(descUser?.subuserId), threads);
        console.log(updatedThreads.threads)
        return updatedThreads.threads
    }


    async searchInfoUser(user_id: string) {
        if (!user_id) throw new Error("Usuario não esta logado");

        const existing = await this.userRepository.getDashboardData(user_id);
        if (!existing) {
            throw new Error("Usuario nâo existe");
        }
        return serializeBigIntAndDate(existing);
    }

    async searchInfoUsers(user_id: string, query: string) {
        if (!query && user_id) throw new Error("è nescessario email ou  id para buscar");
        const userloged = await this.userRepository.findById(user_id);
        if (!userloged) {
            throw new Error("Usuario adm nâo existe");
        }

        const existing = await this.userRepository.searchUsers(query);
        if (!existing) {
            throw new Error("Usuario nâo existe");
        }
        return existing;
    }

    async GetDataDashboard(user_id: string) {
        const existing = await this.userRepository.getDashboardStats();
        return existing;
    }

}

export default ProxyUserService;