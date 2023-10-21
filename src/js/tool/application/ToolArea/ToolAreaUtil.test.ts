import {
    $getStandbyMoveState,
    $setStandbyMoveState,
    $getToolAreaState,
    $setToolAreaState
} from "./ToolAreaUtil";

describe("ToolAreaUtilTest", () =>
{
    test("$getStandbyMoveState and $setStandbyMoveState test", () =>
    {
        expect($getStandbyMoveState()).toBe(false);
        $setStandbyMoveState(true);
        expect($getStandbyMoveState()).toBe(true);
        $setStandbyMoveState(false);
        expect($getStandbyMoveState()).toBe(false);
    });

    test("$getToolAreaState and $setToolAreaState test", () =>
    {
        expect($getToolAreaState()).toBe("fixed");
        $setToolAreaState("move");
        expect($getToolAreaState()).toBe("move");
        $setToolAreaState("fixed");
        expect($getToolAreaState()).toBe("fixed");
    });
});