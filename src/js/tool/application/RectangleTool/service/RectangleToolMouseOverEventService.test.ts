import { execute } from "./RectangleToolMouseOverEventService";
import { $setCursor } from "../../../../global/GlobalUtil";
import { $registerDefaultTool } from "../../ToolUtil";
import { $TOOL_RECTANGLE_NAME } from "../../../../config/ToolConfig";
import { describe, expect, it } from "vitest";

describe("RectangleToolMouseOverEventServiceTest", () =>
{
    it("execute test", () =>
    {
        const mock = {
            "name": $TOOL_RECTANGLE_NAME,
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
        });

        expect(style.getPropertyValue("--tool-cursor")).toBe(mock.cursor);
    });
});