import { execute } from "./UserStrokeSizeUpdateService";
import { execute as userStrokeSizeGetService } from "./UserStrokeSizeGetService";

describe("UserStrokeSizeUpdateServiceTest", () =>
{
    test("execute test", () =>
    {
        execute(100);
        expect(userStrokeSizeGetService()).toBe(100);
    });
});