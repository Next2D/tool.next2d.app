import { execute } from "./SoundAreaLoopCountFocusInEventService";
import { $useKeyboard } from "../../../../shortcut/ShortcutUtil";
import { describe, expect, it } from "vitest";

describe("SoundAreaLoopCountFocusInEventServiceTest", () =>
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