import { execute } from "./RectangleToolPointerOutEventService";
import { $setCursor } from "../../../../global/GlobalUtil";
import { describe, expect, it, vi } from "vitest";

describe("RectangleToolPointerOutEventService Test", () =>
{
    it("execute test", () =>
    {
        $setCursor("test");

        const style = document
            .documentElement
            .style;

        // test case mock1
        expect(style.getPropertyValue("--tool-cursor")).toBe("test");

        let stopPropagation = false;
        expect(stopPropagation).toBe(false);

        execute({
            "stopPropagation": vi.fn(() => { stopPropagation = true; })
        } as unknown as PointerEvent);

        expect(stopPropagation).toBe(true);
        expect(style.getPropertyValue("--tool-cursor")).toBe("auto");
    });
});