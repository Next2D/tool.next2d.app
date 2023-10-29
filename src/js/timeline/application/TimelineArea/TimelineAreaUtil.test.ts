import {
    $getStandbyMoveState,
    $setStandbyMoveState,
    $getTimelineAreaState,
    $setTimelineAreaState
} from "./TimelineAreaUtil";

describe("TimelineAreaUtilTest", () =>
{
    test("$getStandbyMoveState and $setStandbyMoveState test", () =>
    {
        expect($getStandbyMoveState()).toBe(false);
        $setStandbyMoveState(true);
        expect($getStandbyMoveState()).toBe(true);
        $setStandbyMoveState(false);
        expect($getStandbyMoveState()).toBe(false);
    });

    test("$getTimelineAreaState and $setTimelineAreaState test", () =>
    {
        expect($getTimelineAreaState()).toBe("fixed");
        $setTimelineAreaState("move");
        expect($getTimelineAreaState()).toBe("move");
        $setTimelineAreaState("fixed");
        expect($getTimelineAreaState()).toBe("fixed");
    });
});