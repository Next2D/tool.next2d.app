import { execute } from "./TimelineLayerControllerDisableIconWindowPointerUpService";
import { $getDisableState, $setDisableState } from "../../TimelineUtil";
import { describe, expect, it } from "vitest";

describe("TimelineLayerControllerDisableIconWindowPointerUpService Test", () =>
{
    it("execute test", () =>
    {
        $setDisableState(true);
        expect($getDisableState()).toBe(true);
        execute();
        expect($getDisableState()).toBe(false);
    });
});