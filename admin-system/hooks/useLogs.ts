"use client";

import { useState, useEffect } from "react";
import axios from "axios";

type LogType = {
  id: string
  actionType: string
  status: string
  userEmail: string
  adminEmail: string | null
  ip: string
  message: string
  createdAt: string
}


export default function useLogs() {

    const [logs, setLogs] = useState<LogType[]>([])


    useEffect(() => {
        async function fetchLogs() {
            try {
                const response = await axios.get("/api/sistem/logs");
                const data = response.data;

                if (Array.isArray(data.logs)) {
                    setLogs(data.logs as LogType[]);
                } else {
                    setLogs([]);
                }
            } catch (err) {
                console.error("Erro ao buscar logs:", err);
                setLogs([]);
            }
        }

        fetchLogs();
    }, []);

    return { logs };
}
