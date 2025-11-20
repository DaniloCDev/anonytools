import { Request, Response } from "express";
import LogsActivesServices from "../services/logs.actives.services";
import UserRepository from "../repository/user.repository";

const userRepository = new UserRepository();
const logsService = new LogsActivesServices(userRepository);

export async function getLogsController(req: Request, res: Response) {
  try {
    const userId = req.userId; 
    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    const filter = {
      email: req.query.email as string | undefined,
      status: req.query.status as string | undefined,
      actionType: req.query.actionType as string | undefined,
      search: req.query.search as string | undefined,
      page: req.query.page ? Number(req.query.page) : 1,
      perPage: req.query.perPage ? Number(req.query.perPage) : 20,
    };

    const logs = await logsService.listAllLogs(userId, filter);
    res.json(logs);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
