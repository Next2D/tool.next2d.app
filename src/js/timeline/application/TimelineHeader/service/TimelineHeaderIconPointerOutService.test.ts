import { execute } from "./TimelineHeaderIconPointerOutService";
import { describe, expect, it } from "vitest";
import {
    $setMoveIconType,
    $setMoveIconFrame
} from "../../TimelineUtil";

describe("TimelineHeaderIconPointerOutService Test", () =>
{
    it("execute test script", (): void =>
    {
        $setMoveIconType("script");
        $setMoveIconFrame(10);

        const div = document.createElement("div");
        div.style.backgroundColor = "#3692f0";

        expect(div.style.backgroundColor).toBe("rgb(54, 146, 240)");
        execute(div);
        expect(div.style.backgroundColor).toBe("");
    });

});