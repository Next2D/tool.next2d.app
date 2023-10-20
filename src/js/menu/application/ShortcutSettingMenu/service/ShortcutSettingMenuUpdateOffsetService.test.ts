import { $registerMenu } from "../../MenuUtil";
import { execute } from "./ShortcutSettingMenuUpdateOffsetService";
import {
    $SHORTCUT_MENU_NAME,
    $USER_MENU_NAME
} from "../../../../config/MenuConfig";

describe("UShortcutSettingMenuUpdateOffsetServiceTest", () =>
{
    test("execute test", () =>
    {
        const menuMock = {
            "name": $SHORTCUT_MENU_NAME,
            "offsetLeft": 0,
            "offsetTop": 0
        };
        $registerMenu(menuMock);

        const menuDiv = document.createElement("div");
        menuDiv.id = $SHORTCUT_MENU_NAME;
        document.body.appendChild(menuDiv);

        const userMenuDiv = document.createElement("div");
        userMenuDiv.id = $USER_MENU_NAME;
        document.body.appendChild(userMenuDiv);

        expect(menuMock.offsetLeft).toBe(0);
        expect(menuMock.offsetTop).toBe(0);

        execute();
        expect(menuMock.offsetLeft).toBe(0);
        expect(menuMock.offsetTop).toBe(0);

        menuDiv.remove();
        userMenuDiv.remove();
    });
});