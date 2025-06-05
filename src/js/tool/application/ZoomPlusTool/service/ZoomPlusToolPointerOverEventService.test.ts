import { execute } from "./ZoomPlusToolPointerOverEventService";
import { $setCursor } from "../../../../global/GlobalUtil";
import { $registerDefaultTool } from "../../ToolUtil";
import { $TOOL_ZOOM_PLUS_NAME } from "../../../../config/ToolConfig";
import { describe, expect, it, vi } from "vitest";

describe("ZoomPlusToolPointerOverEventService Test", () =>
{
    it("execute test", () =>
    {
        const mock = {
            "name": $TOOL_ZOOM_PLUS_NAME,
            "cursor": "zoom-in"
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
        const mockEvent = {
            "stopPropagation": vi.fn(() => { stopPropagation = true; })
        } as unknown as PointerEvent;

        expect(stopPropagation).toBe(false);
        execute(mockEvent);

        expect(stopPropagation).toBe(true);
        expect(style.getPropertyValue("--tool-cursor")).toBe(mock.cursor);
    });
});