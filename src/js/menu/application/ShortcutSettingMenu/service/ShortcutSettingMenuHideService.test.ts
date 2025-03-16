import { $SHORTCUT_MENU_NAME } from "../../../../config/MenuConfig";
import { $registerMenu } from "../../MenuUtil";
import { execute } from "./ShortcutSettingMenuHideService";
import { describe, expect, it } from "vitest";

describe("ShortcutSettingMenuHideServiceTest", () =>
{
    it("execute test", () =>
    {
        let state = "show";
        const mockMenu = {
            "name": $SHORTCUT_MENU_NAME,
            "hide": () =>
            {
                state = "hide";
            }
        };
        $registerMenu(mockMenu);

        expect(state).toBe("show");
        execute();
        expect(state).toBe("hide");
    });
});