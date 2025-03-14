import { execute } from "./StageSettingWidthPointerDownEventUseCase";
import { describe, expect, it, vi } from "vitest";
import { $setBeforeWidth, $getBeforeWidth } from "../StagsSettingUtil";

describe("StageSettingWidthPointerDownEventUseCase Test", () =>
{
    it("execute test", async () =>
    {
        const input = document.createElement("input");
        input.value = "10";

        let pointerId = 0;
        input.setPointerCapture = vi.fn((pointer_id) => pointerId = pointer_id);

        let stopPropagation = false;
        let preventDefault = false;
        const mockEvent = {
            "button": 0,
            "pointerId": 10,
            "target": input,
            "stopPropagation": vi.fn(() => stopPropagation = true),
            "preventDefault": vi.fn(() => preventDefault = true)
        } as unknown as PointerEvent;

        $setBeforeWidth(100);
        expect($getBeforeWidth()).toBe(100);
        expect(pointerId).toBe(0);
        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);

        execute(mockEvent);

        expect($getBeforeWidth()).toBe(10);
        expect(pointerId).toBe(10);
        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
    });
});