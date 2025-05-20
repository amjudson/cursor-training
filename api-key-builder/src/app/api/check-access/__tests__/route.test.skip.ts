// Polyfill global Request for Node.js/Jest
if (typeof global.Request === 'undefined') {
  global.Request = function() {} as any;
}

import { GET } from "../route";

describe.skip("GET /api/check-access", () => {
  it("returns success", async () => {
    const res = await GET();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
  });
}); 