import { $getStandbyMoveState, $setStandbyMoveState } from "../PropertyAreaUtil";
import { execute } from "./PropertyAreaMouseOutEventService";

describe("TTimelineAreaMouseOutEventServiceTest", () =>
{
    test("execute test", () =>
    {
        $setStandbyMoveState(true);
        expect($getStandbyMoveState()).toBe(true);

        const mockEvent = {
            "stopPropagation": () => { return null },
            "preventDefault": () => { return null }
        };

        execute(mockEvent);
        expect($getStandbyMoveState()).toBe(false);
    });
});