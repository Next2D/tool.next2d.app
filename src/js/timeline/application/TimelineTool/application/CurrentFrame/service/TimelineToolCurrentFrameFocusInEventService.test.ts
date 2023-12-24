import { execute } from "./TimelineToolCurrentFrameFocusInEventService";
import { $useKeyboard } from "../../../../../../shortcut/ShortcutUtil";

describe("TimelineToolCurrentFrameFocusInEventServiceTest", () =>
{
    test("execute test", () =>
    {
        let stopPropagation = false;
        let preventDefault  = false;
        const eventMock = {
            "stopPropagation": () =>
            {
                stopPropagation = true;
            },
            "preventDefault": () => {
                preventDefault = true;
            }
        };

        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);
        expect($useKeyboard()).toBe(false);

        execute(eventMock);

        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
        expect($useKeyboard()).toBe(true);
    });
});