import { execute } from "./TransformSettingInputPointerOverEventService";
import { describe, expect, it, vi } from "vitest";

describe("TransformSettingInputPointerOverEventService Test", () =>
{
    it("execute test", () =>
    {
        const input = document.createElement("input");

        let stopPropagation = false;
        const eventMock = {
            "stopPropagation": () =>
            {
                stopPropagation = true;
            },
            "target": input
        } as unknown as PointerEvent;

        expect(stopPropagation).toBe(false);
        expect(input.style.cursor).toBe("");

        execute(eventMock);

        expect(stopPropagation).toBe(true);
        expect(input.style.cursor).toBe("ew-resize");
    });
});