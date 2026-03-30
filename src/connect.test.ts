import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createTicket,
  finishTicket,
  patchTicket,
  updateManyTickets,
  updateTicket,
} from "./connect.js";

vi.mock("axios");

const mockedAxios = vi.mocked(axios, true);

describe("connect service", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    process.env.API_URL = "http://glpi/apirest.php/";
    process.env.APP_TOKEN = "app-token";
    process.env.AUTH_TOKEN = "auth-token";
  });

  it("createTicket should open session, create and kill session", async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: { session_token: "session-1" } } as never)
      .mockResolvedValueOnce({ data: { success: true } } as never);
    mockedAxios.post.mockResolvedValueOnce({ data: { id: 10 } } as never);

    const result = await createTicket({
      name: "Erro no sistema",
      content: "Nao abre a tela",
    });

    expect(result).toEqual({ id: 10 });
    expect(mockedAxios.post).toHaveBeenCalledWith(
      "http://glpi/apirest.php/Ticket",
      expect.objectContaining({
        input: expect.objectContaining({ name: "Erro no sistema", status: 1 }),
      }),
      expect.any(Object),
    );
    expect(mockedAxios.get).toHaveBeenLastCalledWith(
      "http://glpi/apirest.php/killSession",
      expect.any(Object),
    );
  });

  it("patchTicket should call Ticket/{id} using patch", async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: { session_token: "session-2b" } } as never)
      .mockResolvedValueOnce({ data: { success: true } } as never);
    mockedAxios.patch.mockResolvedValueOnce({ data: { id: 13 } } as never);

    const result = await patchTicket({
      id: 13,
      status: 3,
    });

    expect(result).toEqual({ id: 13 });
    expect(mockedAxios.patch).toHaveBeenCalledWith(
      "http://glpi/apirest.php/Ticket/13",
      expect.objectContaining({
        input: expect.objectContaining({ id: 13, status: 3 }),
      }),
      expect.any(Object),
    );
  });

  it("updateManyTickets should call Ticket/ endpoint", async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: { session_token: "session-2c" } } as never)
      .mockResolvedValueOnce({ data: { success: true } } as never);
    mockedAxios.put.mockResolvedValueOnce({
      data: [{ id: 10 }, { id: 11 }],
    } as never);

    const payload = {
      input: [
        { id: 10, status: 2 },
        { id: 11, priority: 5 },
      ],
    };

    const result = await updateManyTickets(payload);

    expect(result).toEqual([{ id: 10 }, { id: 11 }]);
    expect(mockedAxios.put).toHaveBeenCalledWith(
      "http://glpi/apirest.php/Ticket/",
      payload,
      expect.any(Object),
    );
  });

  it("updateTicket should call Ticket/{id} using put", async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: { session_token: "session-2" } } as never)
      .mockResolvedValueOnce({ data: { success: true } } as never);
    mockedAxios.put.mockResolvedValueOnce({ data: { id: 11 } } as never);

    const result = await updateTicket({
      id: 11,
      content: "Conteudo atualizado",
      status: 2,
    });

    expect(result).toEqual({ id: 11 });
    expect(mockedAxios.put).toHaveBeenCalledWith(
      "http://glpi/apirest.php/Ticket/11",
      expect.objectContaining({
        input: expect.objectContaining({ id: 11, status: 2 }),
      }),
      expect.any(Object),
    );
  });

  it("finishTicket should set status 6", async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: { session_token: "session-3" } } as never)
      .mockResolvedValueOnce({ data: { success: true } } as never);
    mockedAxios.put.mockResolvedValueOnce({ data: { id: 12 } } as never);

    await finishTicket({ id: 12 });

    expect(mockedAxios.put).toHaveBeenCalledWith(
      "http://glpi/apirest.php/Ticket/12",
      {
        input: {
          id: 12,
          status: 6,
        },
      },
      expect.any(Object),
    );
  });

  it("should throw when env is missing", async () => {
    delete process.env.API_URL;

    await expect(createTicket({ name: "x", content: "y" })).rejects.toThrow(
      "Missing GLPI env config",
    );
  });
});
