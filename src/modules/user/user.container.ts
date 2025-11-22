import AuthUserService from "./user.services";
import UserRepository from "./user.repository";
import ProxyUserRepository from "../proxy/user.proxy.repository";
import ProxyUserService from "../proxy/user.proxy.services";
import { UserOrchestrator } from "./user.orchestrator";
import { createLog } from "../logs/logsCreate";

const userRepository = new UserRepository();
const authUserService = new AuthUserService(userRepository);

const proxyUserRepository = new ProxyUserRepository();
const proxyUserService = new ProxyUserService(proxyUserRepository);

const userOrchestrator = new UserOrchestrator(
    authUserService,
    proxyUserService,
    createLog
);

export const userContainer = {
    authUserService,
    userOrchestrator,
};
