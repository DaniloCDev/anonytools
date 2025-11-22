import AuthUserService from "./auth.services";
import AuthRepository from "./auth.respository";
import ProxyUserRepository from "../proxy/user.proxy.repository";
import ProxyUserService from "../proxy/user.proxy.services";
import { AuthOrchestrator } from "./auth.orchestrator";
import { createLog } from "../logs/logsCreate";

const userRepository = new AuthRepository();
const authUserService = new AuthUserService(userRepository);

const proxyUserRepository = new ProxyUserRepository();
const proxyUserService = new ProxyUserService(proxyUserRepository);

const authOrchestrator = new AuthOrchestrator(
    authUserService,
    proxyUserService,
    createLog
);

export const authContainer = {
    authUserService,
    authOrchestrator,
};
