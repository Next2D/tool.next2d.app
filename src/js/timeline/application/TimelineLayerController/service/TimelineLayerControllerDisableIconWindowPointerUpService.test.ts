import { execute } from "./TimelineLayerControllerDisableIconWindowPointerUpService";
import { $getDisableState, $setDisableState } from "../../TimelineUtil";
import { describe, expect, it, vi } from "vitest";

describe("TimelineLayerControllerDisableIconWindowPointerUpService Test", () =>
{
    it("execute test", () =>
    {
        let stopPropagation = false;
        const mockEvent = {
            stopPropagation: vi.fn(() => { stopPropagation = true; }),
        } as unknown as PointerEvent;

        $setDisableState(true)
        expect($getDisableState()).toBe(true);
        expect(stopPropagation).toBe(false);

        execute(mockEvent);

        expect($getDisableState()).toBe(false);
        expect(stopPropagation).toBe(true);
    });
});