import {
    $getStandbyMoveState,
    $setStandbyMoveState,
    $getMouseState,
    $setMouseState
} from "./PropertyAreaUtil";
import { describe, expect, it } from "vitest";

describe("PropertyAreaUtilTest", () =>
{
    it("$getStandbyMoveState and $setStandbyMoveState test", () =>
    {
        expect($getStandbyMoveState()).toBe(false);
        $setStandbyMoveState(true);
        expect($getStandbyMoveState()).toBe(true);
        $setStandbyMoveState(false);
        expect($getStandbyMoveState()).toBe(false);
    });

    it("$getMouseState and $setMouseState test", () =>
    {
        expect($getMouseState()).toBe("up");
        $setMouseState("down");
        expect($getMouseState()).toBe("down");
        $setMouseState("up");
        expect($getMouseState()).toBe("up");
    });
});