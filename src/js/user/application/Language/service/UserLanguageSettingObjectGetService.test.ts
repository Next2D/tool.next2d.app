import { execute } from "./UserLanguageSettingObjectGetService";
import { execute as userLanguageSettingObjectUpdateService } from "./UserLanguageSettingObjectUpdateService";

describe("UserLanguageSettingObjectGetServiceTest", () =>
{
    test("execute test", () =>
    {
        expect(execute()).toBe(null);
        userLanguageSettingObjectUpdateService("Japanese");
        expect(execute()).toBe("Japanese");
    });
});