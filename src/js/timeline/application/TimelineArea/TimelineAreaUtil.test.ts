import {
    $getStandbyMoveState,
    $setStandbyMoveState
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
});