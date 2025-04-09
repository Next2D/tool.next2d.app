import {
    $getStandbyMoveState,
    $setStandbyMoveState
} from "./ToolAreaUtil";
import { describe, expect, it } from "vitest";

describe("ToolAreaUtilTest", () =>
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