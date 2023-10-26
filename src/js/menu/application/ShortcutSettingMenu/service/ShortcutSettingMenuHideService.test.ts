import { $SHORTCUT_MENU_NAME } from "../../../../config/MenuConfig";
import { $registerMenu } from "../../MenuUtil";
import { execute } from "./ShortcutSettingMenuHideService";

describe("ShortcutSettingMenuHideServiceTest", () =>
{
    test("execute test", () =>
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