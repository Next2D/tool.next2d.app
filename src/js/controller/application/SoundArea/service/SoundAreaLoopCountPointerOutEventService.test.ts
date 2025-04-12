import { execute } from "./SoundAreaLoopCountPointerOutEventService";
import { describe, expect, it, vi } from "vitest";

describe("SoundAreaLoopCountPointerOutEventService Test", () =>
{
    it("execute test", () =>
    {
        const input = document.createElement("input");
        input.style.cursor = "ew-resize";

        let stopPropagation = false;
        const eventMock = {
            "stopPropagation": vi.fn(() => { stopPropagation = true }),
            "currentTarget": input
        } as unknown as PointerEvent;

        expect(stopPropagation).toBe(false);
        expect(input.style.cursor).toBe("ew-resize");

        execute(eventMock);

        expect(stopPropagation).toBe(true);
        expect(input.style.cursor).toBe("");
    });
});