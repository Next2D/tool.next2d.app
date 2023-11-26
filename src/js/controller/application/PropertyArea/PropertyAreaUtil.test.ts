import {
    $getStandbyMoveState,
    $setStandbyMoveState,
    $getMouseState,
    $setMouseState
} from "./PropertyAreaUtil";

describe("PropertyAreaUtilTest", () =>
{
    test("$getStandbyMoveState and $setStandbyMoveState test", () =>
    {
        expect($getStandbyMoveState()).toBe(false);
        $setStandbyMoveState(true);
        expect($getStandbyMoveState()).toBe(true);
        $setStandbyMoveState(false);
        expect($getStandbyMoveState()).toBe(false);
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