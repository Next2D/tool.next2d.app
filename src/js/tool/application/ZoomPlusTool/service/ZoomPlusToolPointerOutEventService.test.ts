import { execute } from "./ZoomPlusToolPointerOutEventService";
import { $setCursor } from "../../../../global/GlobalUtil";
import { describe, expect, it, vi } from "vitest";

describe("ZoomPlusToolPointerOutEventService Test", () =>
{
    it("execute test", () =>
    {
        $setCursor("test");

        const style = document
            .documentElement
            .style;

        let stopPropagation = false;
        const mockEvent = {
            "stopPropagation": vi.fn(() => { stopPropagation = true; })
        } as unknown as PointerEvent;

        // test case mock1
        expect(style.getPropertyValue("--tool-cursor")).toBe("test");
        expect(stopPropagation).toBe(false);

        execute(mockEvent);

        expect(stopPropagation).toBe(true);
        expect(style.getPropertyValue("--tool-cursor")).toBe("auto");
    });
});