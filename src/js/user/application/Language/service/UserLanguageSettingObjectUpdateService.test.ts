import { execute } from "./UserLanguageSettingObjectUpdateService";
import { execute as userLanguageSettingObjectGetService } from "./UserLanguageSettingObjectGetService";

describe("UserLanguageSettingObjectUpdateServiceTest", () =>
{
    test("execute test", () =>
    {
        expect(userLanguageSettingObjectGetService()).toBe(null);
        execute("Japanese");
        expect(userLanguageSettingObjectGetService()).toBe("Japanese");
    });
});