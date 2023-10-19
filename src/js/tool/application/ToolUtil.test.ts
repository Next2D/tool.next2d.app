import { EventType } from "../domain/event/EventType";
import {
    $getActiveTool,
    $setActiveTool,
    $registerDefaultTool,
    $getDefaultTool,
    $getMouseState,
    $setMouseState
} from "./ToolUtil";

describe("ToolTest", () =>
{
    test("$getActiveTool and $setActiveTool test", () =>
    {
        let mock1Status = "no";
        const mock1 = {
            "dispatchEvent": (type: string) =>
            {
                mock1Status = EventType.START === type ? "yes" : "no";
            },
            "name": "mock1"
        };

        let mock2Status = "no";
        const mock2 = {
            "dispatchEvent": (type: string) =>
            {
                mock2Status = EventType.START === type ? "yes" : "no";
            },
            "name": "mock2"
        };

        // default
        expect(mock1Status).toBe("no");
        expect(mock2Status).toBe("no");

        // test case mock1
        $setActiveTool(mock1);
        expect(mock1Status).toBe("yes");
        expect(mock2Status).toBe("no");

        const tool1 = $getActiveTool();
        expect(tool1.name).toBe("mock1");

        // test case mock2
        $setActiveTool(mock2);
        expect(mock1Status).toBe("no");
        expect(mock2Status).toBe("yes");

        const tool2 = $getActiveTool();
        expect(tool2.name).toBe("mock2");
    });

    test("$registerDefaultTool and $getDefaultTool test", () =>
    {
        const mock1 = {
            "name": "mock1"
        };

        const mock2 = {
            "name": "mock2"
        };

        $registerDefaultTool(mock1);
        $registerDefaultTool(mock2);

        const tool1 = $getDefaultTool("mock1");
        expect(tool1 === mock1).toBe(true);
        expect(tool1 === mock2).toBe(false);

        const tool2 = $getDefaultTool("mock2");
        expect(tool2 === mock1).toBe(false);
        expect(tool2 === mock2).toBe(true);
    });

    test("$getMouseState and $setMouseState test", () =>
    {
        expect($getMouseState()).toBe("up");
        $setMouseState("down");
        expect($getMouseState()).toBe("down");
        $setMouseState("up");
        expect($getMouseState()).toBe("up");
    });
});