import UserRepository from "../repository/user.repository";

class LogsActivesServices {
    constructor(private userRepository: UserRepository) { }

    async listAllLogs(
        userId: string,
        query: {
            email?: string;
            status?: string;
            actionType?: string;
            search?: string;
            page?: number;
            perPage?: number;
        }
    ) {
        const userLogged = await this.userRepository.findById(userId);
        if (!userLogged || !userLogged.isAdmin) {
            throw new Error("Acesso negado: usuário não é administrador");
        }

        const logs = await this.userRepository.getLogs(query);
        if (!logs) {
            throw new Error("Nenhum log encontrado");
        }
        return logs;
    }
}

export default LogsActivesServices;
