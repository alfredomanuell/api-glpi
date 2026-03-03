
import axios from "axios";

 
export async function createTicket(ticketData:any) {

 let sessionToken;
 let apiUrl = process.env.API_URL;
 let appToken = process.env.APP_TOKEN;
 let authToken = process.env.AUTH_TOKEN;

  try {
    console.log("### Getting Session Token ###");
    const headersAuth = {
      "Content-Type": `application/json`,
      "App-Token": appToken,
      "Authorization": `user_token ${authToken}`,
    };

    const sessionRes = await axios.get(apiUrl + `initSession/`, {
      headers: headersAuth,
    });
    sessionToken = sessionRes.data.session_token;
    console.log("Retrieved Session Token:", sessionToken);

 
    let headers = {
      "Content-Type": `application/json`,
      "Session-Token": sessionToken,
      "App-Token": appToken,
    };

    const payload = {
      input: {
        name: ticketData.name,
        content: ticketData.content,
        status: ticketData.status || 1,
        urgency: ticketData.urgency || 4,
        impact: ticketData.impact || 4,
      },
    };

    const createRes = await axios.post(apiUrl + `Ticket`, payload, {
      headers,
    });
    console.log("Ticket Created:", createRes.data);

 
    console.log(`### Killing actual session (${sessionToken}) ###`);
    const killRes = await axios.get(apiUrl + `killSession`, {
      headers,
    });
    console.log("Session Killed:", killRes.data);

    return createRes.data;
  } catch (error:any) {
    console.error("Error:", error.response?.data || error.message);
    throw error;
  }
}
