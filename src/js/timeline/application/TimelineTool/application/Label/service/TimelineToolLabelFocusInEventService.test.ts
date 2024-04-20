import { execute } from "./TimelineToolLabelFocusInEventService";
import { $useKeyboard } from "../../../../../../shortcut/ShortcutUtil";

describe("TimelineToolLabelFocusInEventServiceTest", () =>
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