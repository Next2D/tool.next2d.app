import { $TOOL_ARROW_NAME } from "../../../../config/ToolConfig";
import { execute } from "./ArrowToolInitializeUseCase";
import { $getActiveTool, $registerDefaultTool } from "../../ToolUtil";
import { describe, expect, it, vi } from "vitest";
import type { ArrowTool } from "../../../../tool/domain/model/ArrowTool";
import { EventType } from "../../../../tool/domain/event/EventType";

describe("ArrowToolInitializeUseCase Test", () =>
{
    it("execute test", () =>
    {
        let start = false;
        let displayObject = false;
        let screen = false;
        let stageRect = false;
        const mock = {
            "addEventListener": vi.fn((type) =>
            {
                switch (type) {

                    case EventType.START:
                        start = true;
                        break;

                    case EventType.DISPLAY_OBJECT:
                        displayObject = true;
                        break;

                    case EventType.SCREEN:
                        screen = true;
                        break;

                    case EventType.STAGE_RECT:
                        stageRect = true;
                        break;

                }
            }),
            "dispatchEvent": vi.fn(),
            "name": $TOOL_ARROW_NAME
        } as unknown as ArrowTool;

        $registerDefaultTool(mock);

        expect(start).toBe(false);
        expect(displayObject).toBe(false);
        expect(screen).toBe(false);
        expect(stageRect).toBe(false);

        execute(mock);

        expect($getActiveTool().name).toBe($TOOL_ARROW_NAME);
        expect(start).toBe(true);
        expect(displayObject).toBe(true);
        expect(screen).toBe(true);
        expect(stageRect).toBe(true);
    });
});