import { $registerMenu } from "../../MenuUtil";
import { execute } from "./ShortcutSettingMenuShowService";
import { describe, expect, it } from "vitest";

describe("ShortcutSettingMenuShowServiceTest", () =>
{
    it("execute test", () =>
    {
        let state = "hide";
        const menuMock = {
            "name": "shortcut-setting-menu",
            "_$state": "hide",
            "show": () =>
            {
                state = "show";
            }
        };
        $registerMenu(menuMock);

        expect(state).toBe("hide");
        execute();
        expect(state).toBe("show");
    });
});