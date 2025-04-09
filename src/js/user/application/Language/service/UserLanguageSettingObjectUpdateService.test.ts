import { execute } from "./UserLanguageSettingObjectUpdateService";
import { execute as userLanguageSettingObjectGetService } from "./UserLanguageSettingObjectGetService";
import { describe, expect, it } from "vitest";

describe("UserLanguageSettingObjectUpdateServiceTest", () =>
{
    it("execute test", () =>
    {
        expect(userLanguageSettingObjectGetService()).toBe(null);
        execute("Japanese");
        expect(userLanguageSettingObjectGetService()).toBe("Japanese");
    });
});