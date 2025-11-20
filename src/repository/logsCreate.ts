import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createLog({
    email,
    action,
    status,
    message,
    ip,
}: {
    email?: string;
    action: string;
    status: "Info" | "Sucesso" | "Erro" | "Aviso";
    message: string;
    ip: string;
}): Promise<void>  {
    try {
        await prisma.activityLog.create({
            data: {
                actionType: action,
                status,
                userEmail: email,
                ip,
                message,
            },
        });
    } catch (error) {
        console.error("Erro ao registrar log de atividade:", error);
    }
}

