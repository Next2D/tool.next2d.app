import { execute } from "./ViewMouseDownEventService";
import { $registerMenu } from "../../../menu/application/MenuUtil";

describe("ViewMouseDownEventServiceTest", () =>
{
    test("execute test", () =>
    {
        let menuState = "show";
        $registerMenu({
            "name": "test",
            "hide": () =>
            {
                menuState = "hide";
            }
        });

        let eventState = "off";
        expect(eventState).toBe("off");
        expect(menuState).toBe("show");

        const eventMock = {
            "stopPropagation": () =>
            {
                eventState = "on";
            },
            "button": 0
        };
        execute(eventMock);

        expect(eventState).toBe("on");
        expect(menuState).toBe("hide");
    });
});