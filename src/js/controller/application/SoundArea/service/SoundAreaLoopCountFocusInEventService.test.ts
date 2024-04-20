import { execute } from "./SoundAreaLoopCountFocusInEventService";
import { $useKeyboard } from "../../../../shortcut/ShortcutUtil";

describe("SoundAreaLoopCountFocusInEventServiceTest", () =>
{
    test("test case", () =>
    {

        const eventMock = {
            "stopPropagation": () => {},
            "preventDefault": () => {}
        };

        expect($useKeyboard()).toBe(false);
        execute(eventMock);
        expect($useKeyboard()).toBe(true);
    });
});