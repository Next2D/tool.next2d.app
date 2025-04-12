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

        let stopPropagation = false;
        const eventMock = {
            "stopPropagation": () =>
            {
                stopPropagation = true;
            },
            "key": "Enter",
            "currentTarget": div
        } as unknown as KeyboardEvent;

        expect(blur).toBe(false);
        expect(stopPropagation).toBe(false);

        execute(eventMock);

        expect(blur).toBe(true);
        expect(stopPropagation).toBe(true);
    });
});