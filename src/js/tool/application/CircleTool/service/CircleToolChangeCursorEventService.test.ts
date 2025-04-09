import { execute } from "./CircleToolChangeCursorEventService";
import { $registerDefaultTool } from "../../ToolUtil";
import { $TOOL_CIRCLE_NAME } from "../../../../config/ToolConfig";
import { describe, expect, it } from "vitest";

describe("CircleToolChangeCursorEventServiceTest", () =>
{
    it("execute test", () =>
    {
        const mock = {
            "name": $TOOL_CIRCLE_NAME,
            "cursor": "crosshair"
        };
        $registerDefaultTool(mock);

        const style = document
            .documentElement
            .style;

        style.setProperty("--tool-cursor", "auto");

        // test case mock1
        expect(style.getPropertyValue("--tool-cursor")).toBe("auto");

        execute();

        expect(style.getPropertyValue("--tool-cursor")).toBe(mock.cursor);
    });

});