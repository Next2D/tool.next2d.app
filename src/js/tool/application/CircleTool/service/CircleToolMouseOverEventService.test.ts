import { execute } from "./CircleToolMouseOverEventService";
import { $setCursor } from "../../../../global/GlobalUtil";
import { $registerDefaultTool } from "../../ToolUtil";
import { $TOOL_CIRCLE_NAME } from "../../../../config/ToolConfig";
import { describe, expect, it } from "vitest";

describe("CircleToolMouseOverEventServiceTest", () =>
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

        execute({
            "stopPropagation": () => {},
            "preventDefault": () => {}
        });

        expect(style.getPropertyValue("--tool-cursor")).toBe(mock.cursor);
    });
});