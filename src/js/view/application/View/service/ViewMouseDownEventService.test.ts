import { execute } from "./ViewMouseDownEventService";
import { $registerMenu } from "../../../../menu/application/MenuUtil";

describe("ShortcutUtilTest", () =>
{
    test("$generateShortcutKey test", () =>
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

        execute({"stopPropagation": () =>
        {
            eventState = "on";
        }});

        expect(eventState).toBe("on");
        expect(menuState).toBe("hide");
    });
});