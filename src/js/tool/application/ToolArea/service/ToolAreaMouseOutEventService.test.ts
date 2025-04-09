import { $setStandbyMoveState, $getStandbyMoveState } from "../ToolAreaUtil";
import { execute } from "./ToolAreaMouseOutEventService";
import { describe, expect, it } from "vitest";

describe("ToolAreaMouseOutEventServiceTest", () =>
{
    it("execute test", () =>
    {
        $setStandbyMoveState(true);
        expect($getStandbyMoveState()).toBe(true);

        const mockEvent = {
            "stopPropagation": () => { return null }
        };

        execute(mockEvent);
        expect($getStandbyMoveState()).toBe(false);
    });
});