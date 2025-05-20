// Polyfill global Request for Node.js/Jest
if (typeof global.Request === 'undefined') {
  global.Request = function() {} as any;
}

import { POST } from "../route";

function mockRequest(body: Record<string, unknown>) {
  return {
    json: async () => body,
  } as unknown as Request;
}

describe.skip("POST /api/validate-key", () => {
  it("returns success for a valid API key", async () => {
    const req = mockRequest({ apiKey: "A123456789012345678901234567890123" });
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it("returns 401 for an invalid API key", async () => {
    const req = mockRequest({ apiKey: "short" });
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(401);
    expect(data.error).toBe("Invalid API key");
  });

  it("returns 400 if apiKey is missing", async () => {
    const req = mockRequest({});
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toBe("API key is required");
  });
}); 