import { execute } from "./UserFillColorUpdateService";
import { execute as userFillColorGetService } from "./UserFillColorGetService";

describe("UserFillColorUpdateServiceTest", () =>
{
    test("execute test", () =>
    {
        execute("#990000");
        expect(userFillColorGetService()).toBe("#990000");
    });
});