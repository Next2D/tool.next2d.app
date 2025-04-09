import { execute } from "./StrokeSizeMouseOutEventService";
import { describe, expect, it } from "vitest";

describe("StrokeSizeMouseOutEventServiceTest", () =>
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
            "target": input
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