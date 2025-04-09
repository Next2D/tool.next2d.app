import { execute } from "./RoundRectToolMouseOverEventService";
import { $setCursor } from "../../../../global/GlobalUtil";
import { $registerDefaultTool } from "../../ToolUtil";
import { $TOOL_ROUND_RECT_NAME } from "../../../../config/ToolConfig";
import { describe, expect, it } from "vitest";

describe("RoundRectToolMouseOverEventServiceTest", () =>
{
    it("execute test", () =>
    {
        const mock = {
            "name": $TOOL_ROUND_RECT_NAME,
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

        execute({
            "stopPropagation": () => {},
            "preventDefault": () => {}
        } as unknown as PointerEvent);

        expect(style.getPropertyValue("--tool-cursor")).toBe(mock.cursor);
    });
});