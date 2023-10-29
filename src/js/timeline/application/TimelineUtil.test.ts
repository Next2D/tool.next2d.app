import {
    $getMouseState,
    $setMouseState
} from "./TimelineUtil";

describe("TimelineUtilTest", () =>
{
    test("$getMouseState and $setMouseState test", () =>
    {
        expect($getMouseState()).toBe("up");
        $setMouseState("down");
        expect($getMouseState()).toBe("down");
        $setMouseState("up");
        expect($getMouseState()).toBe("up");
    });
});