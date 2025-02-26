import { execute } from "./SoundAreaVolumePointerOverEventService";
import { describe, expect, it, vi } from "vitest";

describe("SoundAreaVolumePointerOverEventService Test", () =>
{
    it("execute test", () =>
    {
        const input = document.createElement("input");

        let stopPropagation = false;
        let preventDefault  = false;
        const eventMock = {
            "stopPropagation": vi.fn(() =>
            {
                stopPropagation = true;
            }),
            "preventDefault": vi.fn(() =>
            {
                preventDefault = true;
            }),
            "currentTarget": input
        } as unknown as PointerEvent;

        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);
        expect(input.style.cursor).toBe("");

        execute(eventMock);

        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
        expect(input.style.cursor).toBe("ew-resize");
    });
});