import request from "supertest";
import { describe, expect, it, vi } from "vitest";

import { app } from "./app.js";
import * as connectService from "./connect.js";

describe("Ticket endpoints", () => {
  it("POST /ticket should create ticket", async () => {
    const spy = vi
      .spyOn(connectService, "createTicket")
      .mockResolvedValueOnce({ id: 1001 } as never);

    const response = await request(app).post("/ticket").send({
      name: "Falha login",
      content: "Usuario sem acesso",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 1001 });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("PUT /ticket/editar should update ticket", async () => {
    const spy = vi
      .spyOn(connectService, "updateTicket")
      .mockResolvedValueOnce({ id: 1001 } as never);

    const response = await request(app).put("/ticket/editar").send({
      id: 1001,
      name: "Falha login - atualizado",
      content: "Ajuste no chamado",
      status: 2,
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 2 });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("PUT /ticket/:id should update ticket by URL id", async () => {
    const spy = vi
      .spyOn(connectService, "updateTicket")
      .mockResolvedValueOnce({ id: 1001, status: 2 } as never);

    const response = await request(app).put("/ticket/1001").send({
      name: "Titulo atualizado",
      status: 2,
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 2 });
    expect(spy).toHaveBeenCalledWith({
      id: 1001,
      name: "Titulo atualizado",
      status: 2,
    });
  });

  it("PATCH /ticket/:id should patch ticket by URL id", async () => {
    const spy = vi
      .spyOn(connectService, "patchTicket")
      .mockResolvedValueOnce({ id: 1001, status: 3 } as never);

    const response = await request(app).patch("/ticket/1001").send({
      status: 3,
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 3 });
    expect(spy).toHaveBeenCalledWith({ id: 1001, status: 3 });
  });

  it("PUT /ticket should update many tickets", async () => {
    const spy = vi
      .spyOn(connectService, "updateManyTickets")
      .mockResolvedValueOnce([{ id: 10 }, { id: 11 }] as never);

    const payload = {
      input: [
        { id: 10, status: 2 },
        { id: 11, priority: 5 },
      ],
    };

    const response = await request(app).put("/ticket").send(payload);

    expect(response.status).toBe(200);
    expect(response.body).toBe("Ok!");
    expect(spy).toHaveBeenCalledWith(payload);
  });

  it("PATCH /ticket/encerrar should finish ticket", async () => {
    const spy = vi
      .spyOn(connectService, "finishTicket")
      .mockResolvedValueOnce({ id: 1001, status: 6 } as never);

    const response = await request(app).patch("/ticket/encerrar").send({
      id: 1001,
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 6 });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("should return 500 when service fails", async () => {
    vi.spyOn(connectService, "finishTicket").mockRejectedValueOnce(
      new Error("GLPI down"),
    );

    const response = await request(app).patch("/ticket/encerrar").send({
      id: 1001,
    });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Failed to finish ticket" });
  });
});
