import { execute } from "./UserStrokeColorGetService";

describe("UserStrokeColorGetServiceTest", () =>
{
    test("execute test", () =>
    {
        expect(execute()).toBe("#000000");
    });
});