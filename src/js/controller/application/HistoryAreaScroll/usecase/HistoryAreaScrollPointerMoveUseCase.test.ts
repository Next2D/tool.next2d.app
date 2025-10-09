import { execute } from "./HistoryAreaScrollPointerMoveUseCase";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

describe("HistoryAreaScrollPointerMoveUseCase Test", () =>
{
    let rafCallback: (() => void) | null = null;
    let rafId: number = 0;

    beforeEach(() => {
        rafCallback = null;
        rafId = 0;
        // requestAnimationFrameをモック
        global.requestAnimationFrame = vi.fn((callback: () => void) => {
            rafCallback = callback;
            return ++rafId;
        }) as any;
    });

    afterEach(() => {
        // コールバックをクリア
        rafCallback = null;
    });

    it("test case", () =>
    {
        let stopPropagation = false;
        let preventDefault = false;
        const mockEvent = {
            "movementY": 10,
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
        expect(global.requestAnimationFrame).toHaveBeenCalled();
    });
});