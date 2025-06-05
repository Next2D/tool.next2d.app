import { execute } from "./ZoomToolPointerOverEventService";
import { describe, expect, it, vi } from "vitest";

describe("ZoomToolPointerOverEventService Test", () =>
{
    it("execute test", () =>
    {
        const input = document.createElement("input");

        let stopPropagation = false;
        const eventMock = {
            "stopPropagation": vi.fn(() =>
            {
                stopPropagation = true;
            }),
            "target": input
        } as unknown as PointerEvent;

        expect(stopPropagation).toBe(false);
        expect(input.style.cursor).toBe("");

        execute(eventMock);

        expect(stopPropagation).toBe(true);
        expect(input.style.cursor).toBe("ew-resize");
    });
});