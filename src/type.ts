export type TicketBaseInput = {
  content?: string;
  name?: string;
  status?: number;
  priority?: number;
};

export type CreateTicketInput = TicketBaseInput & {
  name: string;
  content: string;
};

export type UpdateTicketInput = TicketBaseInput & {
  id: number;
};

export type FinishTicketInput = {
  id: number;
};

export type UpdateManyTicketInput = {
  input: UpdateTicketInput[];
};
