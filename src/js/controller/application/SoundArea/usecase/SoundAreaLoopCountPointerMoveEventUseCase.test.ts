import { execute } from "./SoundAreaLoopCountPointerMoveEventUseCase";
import { $setCursor } from "../../../../global/GlobalUtil";
import { describe, expect, it, vi } from "vitest";

describe("SoundAreaLoopCountPointerMoveEventUseCase Test", () =>
{
    it("execute test", async () =>
    {
        const input = document.createElement("input");
        input.dataset.index = "0";
        input.value = "1";

        let stopPropagation = false;
        let preventDefault = false;
        const mockEvent = {
            "stopPropagation": vi.fn(() => { stopPropagation = true; }),
            "preventDefault": vi.fn(() => { preventDefault = true; }),
            "movementX": 10,
            "target": input
        } as unknown as PointerEvent;

        const style = document
            .documentElement
            .style;
            
        $setCursor("auto");
        expect(style.getPropertyValue("--tool-cursor")).toBe("");

        expect(stopPropagation).toBe(false);
        expect(preventDefault).toBe(false);
        expect(input.value).toBe("1");

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
        expect(input.value).toBe("11");
    });
});