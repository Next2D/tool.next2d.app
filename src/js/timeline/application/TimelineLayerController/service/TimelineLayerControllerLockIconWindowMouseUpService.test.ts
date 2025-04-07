import { execute } from "./TimelineLayerControllerLockIconWindowMouseUpService";
import { $getLockState, $setLockState } from "../../TimelineUtil";
import { describe, expect, it } from "vitest";

describe("TTimelineLayerControllerLockIconWindowMouseUpServiceTest", () =>
{
    it("execute test", () =>
    {
        $setLockState(true);
        expect($getLockState()).toBe(true);
        execute();
        expect($getLockState()).toBe(false);
    });
});