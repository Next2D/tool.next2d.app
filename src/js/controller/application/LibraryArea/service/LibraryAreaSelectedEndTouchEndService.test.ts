import { execute } from "./LibraryAreaSelectedEndTouchEndService";
import { $activeTouchPointers } from "../../../../global/GlobalUtil";
import { describe, expect, it, vi } from "vitest";

describe("LibraryAreaSelectedEndTouchEndService Test", () =>
{
    it("execute test", () =>
    {
        let stopPropagation = false;
        let preventDefault = false;
        const mockEvent = {
            "pointerType": "touch",
            "stopPropagation": vi.fn(() =>
            {
                stopPropagation = true;
            }),
            "preventDefault": vi.fn(() =>
            {
                preventDefault = true;
            })

        } as unknown as PointerEvent;

        $activeTouchPointers.clear();
        $activeTouchPointers.add(1);
        $activeTouchPointers.add(2);

        expect($activeTouchPointers.size).toBe(2);
        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);

        execute(mockEvent);

        expect($activeTouchPointers.size).toBe(0);
        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
    });
});