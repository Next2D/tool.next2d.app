import {
    $getStandbyMoveState,
    $setStandbyMoveState
} from "./TimelineAreaUtil";
import { describe, expect, it } from "vitest";

describe("TimelineAreaUtilTest", () =>
{
    it("$getStandbyMoveState and $setStandbyMoveState test", () =>
    {
        expect($getStandbyMoveState()).toBe(false);
        $setStandbyMoveState(true);
        expect($getStandbyMoveState()).toBe(true);
        $setStandbyMoveState(false);
        expect($getStandbyMoveState()).toBe(false);
    });
});