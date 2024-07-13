import { execute } from "./UserStrokeColorUpdateService";
import { execute as userStrokeColorGetService } from "./UserStrokeColorGetService";

describe("UserStrokeColorUpdateServiceTest", () =>
{
    test("execute test", () =>
    {
        execute("#000099");
        expect(userStrokeColorGetService()).toBe("#000099");
    });
});