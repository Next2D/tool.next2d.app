import { $getStandbyMoveState, $setStandbyMoveState } from "../TimelineAreaUtil";
import { execute } from "./TimelineAreaMouseOutEventService";

describe("TTimelineAreaMouseOutEventServiceTest", () =>
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