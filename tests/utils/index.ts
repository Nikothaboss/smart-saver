export const createRequest = (jsonBody: any, endpoint: string) =>
  new Request(`http://localhost/api/${endpoint}`, {
    method: "POST",
    body: JSON.stringify(jsonBody),
    headers: {
      "Content-Type": "application/json",
    },
  });
