import { execute } from "./ScreenMenuShowService";
import { $registerMenu } from "../../MenuUtil";
import { $SCREEN_MENU_NAME } from "../../../../config/MenuConfig";

describe("ScreenMenuShowServiceTest", () =>
{
    test("execute test", () =>
    {
        let prevent = true;
        let state = "on";
        const eventMock = {
            "pageX": 200,
            "pageY": 100,
            "stopPropagation": () =>
            {
                state = "off";
            },
            "preventDefault": () =>
            {
                prevent = false;
            }
        };

        let screenState = "hide";
        const screenMenuMock = {
            "name": $SCREEN_MENU_NAME,
            "offsetLeft": 0,
            "offsetTop": 0,
            "hide": () =>
            {
                screenState = "hide";
            },
            "show": () =>
            {
                screenState = "show";
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

        const div = document.createElement("div");
        document.body.appendChild(div);
        div.id = $SCREEN_MENU_NAME;

        expect(screenMenuMock.offsetLeft).toBe(0);
        expect(screenMenuMock.offsetTop).toBe(0);
        expect(testState).toBe("show");
        expect(screenState).toBe("hide");
        expect(prevent).toBe(true);
        expect(state).toBe("on");

        execute(eventMock);

        expect(screenMenuMock.offsetLeft).toBe(215);
        expect(screenMenuMock.offsetTop).toBe(100);
        expect(screenState).toBe("show");
        expect(testState).toBe("hide");
        expect(prevent).toBe(false);
        expect(state).toBe("off");

        div.remove();
    });
});