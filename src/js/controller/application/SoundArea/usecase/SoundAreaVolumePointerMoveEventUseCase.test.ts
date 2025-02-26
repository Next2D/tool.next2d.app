import { execute } from "./SoundAreaVolumePointerMoveEventUseCase";
import { $setCursor } from "../../../../global/GlobalUtil";
import { describe, expect, it, vi } from "vitest";

describe("SoundAreaVolumePointerMoveEventUseCase Test", () =>
{
    it("execute test case1", async () =>
    {
        const input = document.createElement("input");
        input.dataset.index = "0";
        input.value = "0";

        let stopPropagation = false;
        let preventDefault = false;
        const mockEvent = {
            "stopPropagation": vi.fn(() => { stopPropagation = true; }),
            "preventDefault": vi.fn(() => { preventDefault = true; }),
            "movementX": 320,
            "target": input
        } as unknown as PointerEvent;

        const style = document
            .documentElement
            .style;
            
        $setCursor("auto");
        expect(style.getPropertyValue("--tool-cursor")).toBe("");

        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);
        expect(input.value).toBe("0");

        execute(mockEvent);
        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);
        expect(style.getPropertyValue("--tool-cursor")).toBe("ew-resize");

        await new Promise<void>((resolve) =>
        {
            setTimeout(() =>
            {
                resolve();
            }, 30);
        });
        expect(input.value).toBe("100");
    });

    it("execute test case2", async () =>
    {
        const input = document.createElement("input");
        input.dataset.index = "0";
        input.value = "100";

        let stopPropagation = false;
        let preventDefault = false;
        const mockEvent = {
            "stopPropagation": vi.fn(() => { stopPropagation = true; }),
            "preventDefault": vi.fn(() => { preventDefault = true; }),
            "movementX": -220,
            "target": input
        } as unknown as PointerEvent;

        const style = document
            .documentElement
            .style;
            
        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);
        expect(input.value).toBe("100");

        execute(mockEvent);
        expect(stopPropagation).toBe(true);
        expect(preventDefault).toBe(true);

        await new Promise<void>((resolve) =>
        {
            setTimeout(() =>
            {
                resolve();
            }, 30);
        });
        expect(input.value).toBe("0");
    });
});