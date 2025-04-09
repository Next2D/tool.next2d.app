import { execute } from "./UserLanguageSettingObjectGetService";
import { execute as userLanguageSettingObjectUpdateService } from "./UserLanguageSettingObjectUpdateService";
import { describe, expect, it } from "vitest";

describe("UserLanguageSettingObjectGetServiceTest", () =>
{
    it("execute test", () =>
    {
        expect(execute()).toBe(null);
        userLanguageSettingObjectUpdateService("Japanese");
        expect(execute()).toBe("Japanese");
    });
});