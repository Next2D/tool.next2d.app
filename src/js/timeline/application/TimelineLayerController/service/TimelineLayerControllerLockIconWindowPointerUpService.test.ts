import { execute } from "./TimelineLayerControllerLockIconWindowPointerUpService";
import { $getLockState, $setLockState } from "../../TimelineUtil";
import { describe, expect, it } from "vitest";

describe("TimelineLayerControllerLockIconWindowPointerUpService Test", () =>
{
    it("execute test", () =>
    {
        $setLockState(true);
        expect($getLockState()).toBe(true);
        execute();
        expect($getLockState()).toBe(false);
    });
});