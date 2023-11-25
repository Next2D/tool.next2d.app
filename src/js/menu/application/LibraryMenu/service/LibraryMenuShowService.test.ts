import { execute } from "./LibraryMenuShowService";
import { $registerMenu } from "../../MenuUtil";
import { $LIBRARY_MENU_NAME } from "../../../../config/MenuConfig";

describe("LibraryMenuShowServiceTest", () =>
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

        let libraryState = "hide";
        const libraryMenuMock = {
            "name": $LIBRARY_MENU_NAME,
            "offsetLeft": 0,
            "offsetTop": 0,
            "hide": () =>
            {
                libraryState = "hide";
            },
            "show": () =>
            {
                libraryState = "show";
            }
        };
        $registerMenu(libraryMenuMock);

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
        div.id = $LIBRARY_MENU_NAME;

        expect(libraryMenuMock.offsetLeft).toBe(0);
        expect(libraryMenuMock.offsetTop).toBe(0);
        expect(testState).toBe("show");
        expect(libraryState).toBe("hide");
        expect(prevent).toBe(true);
        expect(state).toBe("on");

        execute(eventMock);

        expect(libraryMenuMock.offsetLeft).toBe(215);
        expect(libraryMenuMock.offsetTop).toBe(100);
        expect(libraryState).toBe("show");
        expect(testState).toBe("hide");
        expect(prevent).toBe(false);
        expect(state).toBe("off");

        div.remove();
    });
});