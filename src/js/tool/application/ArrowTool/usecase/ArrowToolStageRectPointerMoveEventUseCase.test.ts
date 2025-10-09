import { execute } from "./ArrowToolStageRectPointerMoveEventUseCase";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

describe("ArrowToolStageRectPointerMoveEventUseCase Test", () =>
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

    it("execute test", () =>
    {
        let stopPropagation = false;
        let preventDefault = false;
        const mockEvent = {
            "stopPropagation": vi.fn(() =>
            {
                stopPropagation = true;
            }),
            "preventDefault": vi.fn(() =>
            {
                preventDefault = true;
            }),
            "pageX": 100,
            "pageY": 100
        } as unknown as PointerEvent;

        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);
        execute(mockEvent);
        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
        expect(global.requestAnimationFrame).toHaveBeenCalled();
    });
});