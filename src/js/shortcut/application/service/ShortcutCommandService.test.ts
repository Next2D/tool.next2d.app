import { execute } from "./ShortcutCommandService";
import { $setGlobalShortcut } from "../../ShortcutUtil";

describe("ShortcutCommandServiceTest", () =>
{
    test("execute test", () =>
    {
        let stop = false;
        let stopImmediate = false;
        let prevent = false;

        const eventMock = {
            "key": "a",
            "shiftKey": false,
            "ctrlKey": false,
            "metaKey": false,
            "altKey": false,
            "stopImmediatePropagation": () =>
            {
                stopImmediate = true;
            },
            "stopPropagation": () =>
            {
                stop = true;
            },
            "preventDefault": () =>
            {
                prevent = true;
            }
        };

        let state = "off";
        $setGlobalShortcut("a", () =>
        {
            state = "on";
        });

        expect(stop).toBe(false);
        expect(stopImmediate).toBe(false);
        expect(prevent).toBe(false);
        expect(state).toBe("off");

        execute(eventMock);

        expect(stop).toBe(true);
        expect(stopImmediate).toBe(true);
        expect(prevent).toBe(true);
        expect(state).toBe("on");
    });
});