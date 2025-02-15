import { execute } from "./SoundAreaVolumeKeyPressEventService";
import { describe, expect, it } from "vitest";

describe("SoundAreaVolumeKeyPressEventServiceTest", () =>
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
            "key": "Enter",
            "currentTarget": document.createElement("div")
        } as unknown as KeyboardEvent;

        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);
        execute(eventMock);
        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
    });
});