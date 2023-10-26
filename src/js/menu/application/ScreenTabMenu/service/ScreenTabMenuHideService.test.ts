import { $SCREEN_TAB_MENU_NAME } from "../../../../config/MenuConfig";
import { $registerMenu } from "../../MenuUtil";
import { execute } from "./ScreenTabMenuHideService";

describe("ScreenTabMenuHideServiceTest", () =>
{
    test("execute test", () =>
    {
        let state = "show";
        const mockMenu = {
            "name": $SCREEN_TAB_MENU_NAME,
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