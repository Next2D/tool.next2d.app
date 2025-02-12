import { execute } from "./HistoryAreaScrollPointerMoveUseCase";
import { describe, expect, it } from "vitest";

describe("HistoryAreaScrollPointerMoveUseCase Test", () =>
{
    it("test case", () =>
    {
        let stopPropagation = false;
        let preventDefault = false;
        const mockEvent = {
            "movementY": 0,
            "target": document.createElement("div") as unknown,
            "stopPropagation": () =>
            {
                stopPropagation = true;
            },
            "preventDefault": () =>
            {
                preventDefault = true;
            }
        } as PointerEvent;

        expect(preventDefault).toBe(false);
        expect(stopPropagation).toBe(false);

        execute(mockEvent);

        expect(preventDefault).toBe(true);
        expect(stopPropagation).toBe(true);
    });
});