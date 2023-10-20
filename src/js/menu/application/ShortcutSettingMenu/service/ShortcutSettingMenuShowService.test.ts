import { $registerMenu } from "../../MenuUtil";
import { execute } from "./ShortcutSettingMenuShowService";

describe("ShortcutSettingMenuShowServiceTest", () =>
{
    test("execute test", () =>
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