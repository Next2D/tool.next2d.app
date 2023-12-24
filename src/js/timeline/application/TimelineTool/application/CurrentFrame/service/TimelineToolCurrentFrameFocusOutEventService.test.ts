import { execute } from "./TimelineToolCurrentFrameFocusOutEventService";
import { $useKeyboard, $updateKeyLock } from "../../../../../../shortcut/ShortcutUtil";

describe("TimelineToolCurrentFrameFocusOutEventServiceTest", () =>
{
    test("execute test", () =>
    {
        $updateKeyLock(true);

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
        expect($useKeyboard()).toBe(true);

        execute(eventMock);

        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
        expect($useKeyboard()).toBe(false);
    });
});