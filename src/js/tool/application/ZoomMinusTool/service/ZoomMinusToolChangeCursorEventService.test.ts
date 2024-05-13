import { execute } from "./ZoomMinusToolChangeCursorEventService";
import { $registerDefaultTool } from "../../ToolUtil";
import { $TOOL_ZOOM_MINUS_NAME } from "../../../../config/ToolConfig";

describe("ZoomMinusToolChangeCursorEventServiceTest", () =>
{
    test("execute test", () =>
    {
        const mock = {
            "name": $TOOL_ZOOM_MINUS_NAME,
            "cursor": "zoom-out"
        };
        $registerDefaultTool(mock);

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