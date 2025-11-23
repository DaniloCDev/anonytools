import ProxyUserService from "./user.proxy.services";
import ProxyUserRepository from "../proxy/user.proxy.repository";

const proxyUserRepository = new ProxyUserRepository();
const proxyUserService = new ProxyUserService(proxyUserRepository);

export const proxyContainer = {
    proxyUserService,
};
