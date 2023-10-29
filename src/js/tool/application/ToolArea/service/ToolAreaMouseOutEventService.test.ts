import { $setStandbyMoveState, $getStandbyMoveState } from "../ToolAreaUtil";
import { execute } from "./ToolAreaMouseOutEventService";

describe("ToolAreaMouseOutEventServiceTest", () =>
{
    test("execute test", () =>
    {
        $setStandbyMoveState(true);
        expect($getStandbyMoveState()).toBe(true);

        const mockEvent = {
            "stopPropagation": () => { return null }
        };

        execute(mockEvent);
        expect($getStandbyMoveState()).toBe(false);
    });
});