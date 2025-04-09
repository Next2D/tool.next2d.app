import { execute } from "./StrokeSizeFocusInEventService";
import { $useKeyboard } from "../../../../shortcut/ShortcutUtil";
import { describe, expect, it } from "vitest";

describe("StrokeSizeFocusInEventServiceTest", () =>
{
    it("execute test", () =>
    {
        let preventDefault = false;
        let stopPropagation = false;
        const eventMock = {
            "stopPropagation": () =>
            {
                stopPropagation = true;
            },
            "preventDefault": () =>
            {
                preventDefault = true;
            },
            "currentTarget": document.createElement("div")
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