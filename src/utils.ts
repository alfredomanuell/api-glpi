export function getTicketId(result: unknown): number | null {
    if (typeof result === "object" && result !== null && "id" in result) {
      const id = (result as { id: unknown }).id;
      if (typeof id === "number") {
        return id;
      }
    }
  
    return null;
  }
  
 export function getTicketStatus(result: unknown): number | null {
    if (typeof result !== "object" || result === null) {
      return null;
    }
  
    const data = result as { status?: unknown; input?: { status?: unknown } };
    if (typeof data.status === "number") {
      return data.status;
    }
  
    if (typeof data.input?.status === "number") {
      return data.input.status;
    }
  
    return null;
  }