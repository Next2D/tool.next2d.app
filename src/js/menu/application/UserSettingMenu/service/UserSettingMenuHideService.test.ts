import { $USER_MENU_NAME } from "../../../../config/MenuConfig";
import { $registerMenu } from "../../MenuUtil";
import { execute } from "./UserSettingMenuHideService";

describe("UserSettingMenuHideServiceTest", () =>
{
    test("execute test", () =>
    {
        let state = "show";
        const menuMock = {
            "name": $USER_MENU_NAME,
            "hide": () =>
            {
                state = "hide";
            }
        };
        $registerMenu(menuMock);

        expect(state).toBe("show");
        execute();
        expect(state).toBe("hide");
    });
});