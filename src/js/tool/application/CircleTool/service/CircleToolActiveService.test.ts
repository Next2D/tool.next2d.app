import { $TOOL_CIRCLE_NAME } from "../../../../config/ToolConfig";
import { execute } from "./CircleToolActiveService";
import { $setActiveTool, $getActiveTool, $registerDefaultTool } from "../../ToolUtil";
import { describe, expect, it } from "vitest";

describe("CircleToolActiveServiceTest", () =>
{
    it("execute test", () =>
    {
        const mock1 = {
            "dispatchEvent": () => {},
            "name": "mock1"
        };
        $registerDefaultTool(mock1);

        const mock2 = {
            "dispatchEvent": () => {},
            "name": $TOOL_CIRCLE_NAME
        };
        $registerDefaultTool(mock2);

        // test case mock1
        $setActiveTool(mock1);
        expect($getActiveTool().name).toBe(mock1.name);

        execute();

        expect($getActiveTool().name).toBe(mock2.name);
    });

});