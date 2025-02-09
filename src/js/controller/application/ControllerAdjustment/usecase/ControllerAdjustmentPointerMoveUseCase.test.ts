import { execute } from "./ControllerAdjustmentPointerMoveUseCase";
import { describe, expect, it, vi } from "vitest";

describe("ControllerAdjustmentPointerMoveUseCase Test", () =>
{
    it("test case", () =>
    {
        let stopPropagation = false;
        let preventDefault = false;
        const MockEvent = {
            "movementX": 0,
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

        execute(MockEvent);

        expect(preventDefault).toBe(true);
        expect(stopPropagation).toBe(true);
    });
});