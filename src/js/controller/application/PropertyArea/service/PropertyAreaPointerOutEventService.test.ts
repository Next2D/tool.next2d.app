import { $getStandbyMoveState, $setStandbyMoveState } from "../PropertyAreaUtil";
import { execute } from "./PropertyAreaPointerOutEventService";
import { describe, expect, it } from "vitest";

describe("PropertyAreaPointerOutEventService Test", () =>
{
    it("execute test", () =>
    {
        $setStandbyMoveState(true);
        expect($getStandbyMoveState()).toBe(true);

        const mockEvent = {
            "stopPropagation": () => { return null },
            "preventDefault": () => { return null }
        } as unknown as PointerEvent;

        execute(mockEvent);
        expect($getStandbyMoveState()).toBe(false);
    });
});