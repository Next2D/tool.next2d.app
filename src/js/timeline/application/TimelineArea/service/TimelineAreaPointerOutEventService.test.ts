import { $getStandbyMoveState, $setStandbyMoveState } from "../TimelineAreaUtil";
import { execute } from "./TimelineAreaPointerOutEventService";
import { describe, expect, it } from "vitest";

describe("TimelineAreaPointerOutEventService Test", () =>
{
    it("execute test", () =>
    {
        $setStandbyMoveState(true);
        expect($getStandbyMoveState()).toBe(true);

        const mockEvent = {
            "stopPropagation": () => { return null }
        } as unknown as PointerEvent;

        execute(mockEvent);
        expect($getStandbyMoveState()).toBe(false);
    });
});