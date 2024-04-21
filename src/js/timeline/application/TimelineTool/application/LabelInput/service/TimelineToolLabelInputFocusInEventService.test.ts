import { execute } from "./TimelineToolLabelInputFocusInEventService";
import { $useKeyboard } from "../../../../../../shortcut/ShortcutUtil";

describe("TimelineToolLabelInputFocusInEventServiceTest", () =>
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