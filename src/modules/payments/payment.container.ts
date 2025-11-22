import PaymentUserService from "./payment.service";
import PaymentRepository from "./payment.repository";
import { PaymentOrchestrator } from "./payment.orchestrator";
import { addToBalance } from "../proxy/dataimpulse";

const paymentRepository = new PaymentRepository();
const paymentUserService = new PaymentUserService(paymentRepository);

const paymentOrchestrator = new PaymentOrchestrator(
    paymentUserService,
    addToBalance,
    paymentRepository
);

export const paymentContainer = {
    paymentUserService,
    paymentOrchestrator,
};
