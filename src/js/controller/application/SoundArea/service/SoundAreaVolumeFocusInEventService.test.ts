import { execute } from "./SoundAreaVolumeFocusInEventService";
import { $useKeyboard } from "../../../../shortcut/ShortcutUtil";
import { describe, expect, it } from "vitest";

describe("SoundAreaVolumeFocusInEventServiceTest", () =>
{
    it("test case", () =>
    {

        const eventMock = {
            "stopPropagation": () => {},
            "preventDefault": () => {}
        } as unknown as FocusEvent;

        expect($useKeyboard()).toBe(false);
        execute(eventMock);
        expect($useKeyboard()).toBe(true);
    });
});