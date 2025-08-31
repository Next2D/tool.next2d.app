import { execute } from "./TransformSettingYPointerMoveEventUseCase";
import { describe, expect, it, vi } from "vitest";

describe("TransformSettingYPointerMoveEventUseCase Test", () =>
{
    it("execute test", () =>
    {
        const input = document.createElement("input");
        input.value = "100";

        let stopPropagation = false;
        let preventDefault = false;
        const mockEvent = {
            movementX: 1,
            target: input,
            stopPropagation: vi.fn(() =>
            {
                stopPropagation = true;
            }),
            preventDefault: vi.fn(() =>
            {
                preventDefault = true;
            })
        } as unknown as PointerEvent;

        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);
        
        execute(mockEvent);

        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
    });
});