import { execute } from "./UserFillColorGetService";

describe("UserFillColorGetServiceTest", () =>
{
    test("execute test", () =>
    {
        expect(execute()).toBe("#000000");
    });
});