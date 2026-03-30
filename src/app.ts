import express from "express";
import {
  createTicket,
  finishTicket,
  patchTicket, 
  updateTicket,
} from "./connect.js";
import { getTicketId, getTicketStatus } from "./utils.js";

export const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.json("Ok!");
});

app.post("/ticket", async (req, res) => {
  try {
    const result = await createTicket(req.body);
    const id = getTicketId(result);
    res.json({ id });
  } catch {
    res.status(500).json({ error: "Failed to create ticket" });
  }
});  

app.patch("/ticket/encerrar", async (req, res) => {
  try {
    const result = await finishTicket(req.body); 
    res.json({ result });
  } catch {
    res.status(500).json({ error: "Failed to finish ticket" });
  }
});

app.put("/ticket/:id", async (req, res) => {
  try {
    const result = await updateTicket({
      ...req.body,
      id: Number(req.params.id),
    });
    const status = getTicketStatus(result) ?? req.body.status ?? null;
    res.json({ result });
  } catch {
    res.status(500).json({ error: "Failed to update ticket" });
  }
});

app.patch("/ticket/:id", async (req, res) => {
  try {
    const result = await patchTicket({
      ...req.body,
      id: Number(req.params.id),
    });
    const status = getTicketStatus(result) ?? req.body.status ?? null;
    res.json({ status });
  } catch {
    res.status(500).json({ error: "Failed to update ticket" });
  }
});
