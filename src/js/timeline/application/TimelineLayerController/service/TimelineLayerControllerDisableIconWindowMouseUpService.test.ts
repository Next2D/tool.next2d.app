import { execute } from "./TimelineLayerControllerDisableIconWindowMouseUpService";
import { $getDisableState, $setDisableState } from "../../TimelineUtil";
import { describe, expect, it } from "vitest";

describe("TimelineLayerControllerDisableIconWindowMouseUpServiceTest", () =>
{
    it("execute test", () =>
    {
        $setDisableState(true);
        expect($getDisableState()).toBe(true);
        execute();
        expect($getDisableState()).toBe(false);
    });
});