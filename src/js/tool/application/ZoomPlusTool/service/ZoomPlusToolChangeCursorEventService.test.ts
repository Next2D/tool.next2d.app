import { execute } from "./ZoomPlusToolChangeCursorEventService";
import { $registerDefaultTool } from "../../ToolUtil";
import { $TOOL_ZOOM_PLUS_NAME } from "../../../../config/ToolConfig";

describe("ZoomPlusToolChangeCursorEventServiceTest", () =>
{
    test("execute test", () =>
    {
        const mock = {
            "name": $TOOL_ZOOM_PLUS_NAME,
            "cursor": "zoom-in"
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