import { execute } from "./ScreenMenuHideSubMenuService";
import { $registerMenu } from "../../MenuUtil";
import { $SCREEN_MENU_NAME } from "../../../../config/MenuConfig";

describe("ScreenMenuHideSubMenuServiceTest", () =>
{
    test("execute test", () =>
    {
        let eventState = "on";
        const mockEvent = {
            "stopPropagation": () =>
            {
                eventState = "off";
            }
        };

        let screenState = "show";
        const screenMenuMock = {
            "name": $SCREEN_MENU_NAME,
            "hide": () =>
            {
                screenState = "hide";
            }
        };
        $registerMenu(screenMenuMock);

        let testState = "show";
        const testMockMenu = {
            "name": "test",
            "hide": () =>
            {
                testState = "hide";
            }
        };
        $registerMenu(testMockMenu);
        
        expect(testState).toBe("show");
        expect(eventState).toBe("on");

        expect(screenState).toBe("show");
        execute(mockEvent);
        expect(screenState).toBe("show");

        expect(testState).toBe("hide");
        expect(eventState).toBe("off");
    });
});