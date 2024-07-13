import { execute } from "./RoundRectToolChangeCursorEventService";
import { $registerDefaultTool } from "../../ToolUtil";
import { $TOOL_ROUND_RECT_NAME } from "../../../../config/ToolConfig";

describe("RoundRectToolChangeCursorEventServiceTest", () =>
{
    test("execute test", () =>
    {
        const mock = {
            "name": $TOOL_ROUND_RECT_NAME,
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