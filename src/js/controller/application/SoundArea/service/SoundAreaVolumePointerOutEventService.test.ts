import { execute } from "./SoundAreaVolumePointerOutEventService";
import { describe, expect, it } from "vitest";

describe("SoundAreaVolumePointerOutEventService Test", () =>
{
    it("execute test", () =>
    {
        const input = document.createElement("input");
        input.style.cursor = "ew-resize";

        let stopPropagation = false;
        let preventDefault  = false;
        const eventMock = {
            "stopPropagation": () =>
            {
                stopPropagation = true;
            },
            "preventDefault": () => {
                preventDefault = true;
            },
            "currentTarget": input
        } as unknown as PointerEvent;

        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);
        expect(input.style.cursor).toBe("ew-resize");

        execute(eventMock);

        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
        expect(input.style.cursor).toBe("");
    });
});