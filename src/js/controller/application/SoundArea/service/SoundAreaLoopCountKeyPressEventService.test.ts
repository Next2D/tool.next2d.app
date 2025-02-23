import { execute } from "./SoundAreaLoopCountKeyPressEventService";
import { describe, expect, it, vi } from "vitest";

describe("SoundAreaLoopCountKeyPressEventServiceTest", () =>
{
    it("execute test", () =>
    {
        const div = document.createElement("div");

        let blur = false;
        div.blur = vi.fn(() =>
        {
            blur = true;
        });

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
            "key": "Enter",
            "currentTarget": div
        } as unknown as KeyboardEvent;

        expect(blur).toBe(false);
        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);

        execute(eventMock);

        expect(blur).toBe(true);
        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
    });
});