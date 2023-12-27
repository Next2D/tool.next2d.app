import { execute } from "./TimelineLayerControllerLockIconWindowMouseUpService";
import { $getLockState, $setLockState } from "../../TimelineUtil";

describe("TTimelineLayerControllerLockIconWindowMouseUpServiceTest", () =>
{
    test("execute test", () =>
    {
        $setLockState(true);
        expect($getLockState()).toBe(true);
        execute();
        expect($getLockState()).toBe(false);
    });
});