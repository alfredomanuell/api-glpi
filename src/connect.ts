import axios from "axios";
import {
  CreateTicketInput,
  FinishTicketInput,
  UpdateManyTicketInput,
  UpdateTicketInput,
} from "./type.js";

function getEnvConfig() {
  const apiUrl = process.env.API_URL;
  const appToken = process.env.APP_TOKEN;
  const authToken = process.env.AUTH_TOKEN;

  if (!apiUrl || !appToken || !authToken) {
    throw new Error("Missing GLPI env config (API_URL, APP_TOKEN, AUTH_TOKEN)");
  }

  return { apiUrl, appToken, authToken };
}

async function initSession() {
  const { apiUrl, appToken, authToken } = getEnvConfig();

  const sessionRes = await axios.get(`${apiUrl}initSession/`, {
    headers: {
      "Content-Type": "application/json",
      "App-Token": appToken,
      Authorization: `user_token ${authToken}`,
    },
  });

  return {
    apiUrl,
    appToken,
    sessionToken: sessionRes.data.session_token as string,
  };
}

async function killSession(
  apiUrl: string,
  sessionToken: string,
  appToken: string,
) {
  await axios.get(`${apiUrl}killSession`, {
    headers: {
      "Content-Type": "application/json",
      "Session-Token": sessionToken,
      "App-Token": appToken,
    },
  });
}

function buildSessionHeaders(sessionToken: string, appToken: string) {
  return {
    "Content-Type": "application/json",
    "Session-Token": sessionToken,
    "App-Token": appToken,
  };
}

export async function createTicket(ticketData: CreateTicketInput) {
  const { apiUrl, appToken, sessionToken } = await initSession();
  const headers = buildSessionHeaders(sessionToken, appToken);

  try {
    const payload = {
      input: {
        name: ticketData.name,
        content: ticketData.content,
        status: ticketData.status ?? 1,
        priority: ticketData.priority ?? 3,
      },
    };

    const response = await axios.post(`${apiUrl}Ticket`, payload, { headers });
    return response.data;
  } finally {
    await killSession(apiUrl, sessionToken, appToken);
  }
}

async function updateTicketByMethod(
  ticketData: UpdateTicketInput,
  method: "put" | "patch",
) {
  const { apiUrl, appToken, sessionToken } = await initSession();
  const headers = buildSessionHeaders(sessionToken, appToken);

  try {
    const payload = {
      input: {
        id: ticketData.id,
        name: ticketData.name,
        content: ticketData.content,
        status: ticketData.status,
        priority: ticketData.priority,
      },
    };

    const response = await axios[method](
      `${apiUrl}Ticket/${ticketData.id}`,
      payload,
      { headers },
    );
    return response.data;
  } finally {
    await killSession(apiUrl, sessionToken, appToken);
  }
}

export async function updateTicket(ticketData: UpdateTicketInput) {
  return updateTicketByMethod(ticketData, "put");
}

export async function patchTicket(ticketData: UpdateTicketInput) {
  return updateTicketByMethod(ticketData, "patch");
}

export async function updateManyTickets(ticketData: UpdateManyTicketInput) {
  const { apiUrl, appToken, sessionToken } = await initSession();
  const headers = buildSessionHeaders(sessionToken, appToken);

  try {
    const response = await axios.put(`${apiUrl}Ticket/`, ticketData, {
      headers,
    });
    return response.data;
  } finally {
    await killSession(apiUrl, sessionToken, appToken);
  }
}

export async function finishTicket(ticketData: FinishTicketInput) {
  const { apiUrl, appToken, sessionToken } = await initSession();
  const headers = buildSessionHeaders(sessionToken, appToken);

  try {
    const payload = {
      input: {
        id: ticketData.id,
        status: 6,
      },
    };

    const response = await axios.put(
      `${apiUrl}Ticket/${ticketData.id}`,
      payload,
      { headers },
    );
    return response.data;
  } finally {
    await killSession(apiUrl, sessionToken, appToken);
  }
}
