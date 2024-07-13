import { execute } from "./UserStrokeSizeGetService";

describe("UserStrokeSizeGetServiceTest", () =>
{
    test("execute test", () =>
    {
        expect(execute()).toBe(0);
    });
});