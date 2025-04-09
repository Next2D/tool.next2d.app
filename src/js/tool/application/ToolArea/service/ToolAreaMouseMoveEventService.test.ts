import { $setActiveTool } from "../../ToolUtil";
import { execute } from "./ToolAreaMouseMoveEventService";
import { EventType } from "../../../domain/event/EventType";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import { describe, expect, it } from "vitest";

describe("ToolAreaMouseMoveEventServiceTest", () =>
{
    it("execute test", () =>
    {
        const workSpace = $getCurrentWorkSpace() || $createWorkSpace();

        let status = "no";

        // mack tool
        const mock = {
            "dispatchEvent": (type: string, event: any) =>
            {
                if (EventType.POINTER_MOVE !== type) {
                    return ;
                }
                status = event.status;
            },
            "name": "mock"
        };

        const mockEvent = {
            "status": "yes",
            "stopPropagation": () => { return null }
        };

        expect(status).toBe("no");
        execute(mockEvent);
        expect(status).toBe("no");

        $setActiveTool(mock);
        execute(mockEvent);
        expect(status).toBe("yes");
    });
});