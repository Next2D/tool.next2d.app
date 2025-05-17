import { execute } from "./CircleToolPointerOverEventService";
import { $setCursor } from "../../../../global/GlobalUtil";
import { $registerDefaultTool } from "../../ToolUtil";
import { $TOOL_CIRCLE_NAME } from "../../../../config/ToolConfig";
import { describe, expect, it, vi } from "vitest";

describe("CircleToolPointerOverEventService Test", () =>
{
    it("execute test", () =>
    {
        const mock = {
            "name": $TOOL_CIRCLE_NAME,
            "cursor": "crosshair"
        };
        $registerDefaultTool(mock);

        $setCursor("auto");

        const style = document
            .documentElement
            .style;

        style.setProperty("--tool-cursor", "auto");

        // test case mock1
        expect(style.getPropertyValue("--tool-cursor")).toBe("auto");

        let stopPropagation = false;
        expect(stopPropagation).toBe(false);
        execute({
            "stopPropagation": vi.fn(() => { stopPropagation = true; })
        } as unknown as PointerEvent);

        expect(stopPropagation).toBe(true);
        expect(style.getPropertyValue("--tool-cursor")).toBe(mock.cursor);
    });
});