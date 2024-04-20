import { execute } from "./SoundAreaVolumeFocusInEventService";
import { $useKeyboard } from "../../../../shortcut/ShortcutUtil";

describe("SoundAreaVolumeFocusInEventServiceTest", () =>
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