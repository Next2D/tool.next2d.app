import { execute } from "./TimelineHeaderIconPointerOverService";
import { describe, expect, it } from "vitest";
import {
    $setMoveIconType,
    $setMoveIconFrame
} from "../../TimelineUtil";

describe("TimelineHeaderIconPointerOverService Test", () =>
{
    it("execute test script", (): void =>
    {
        $setMoveIconType("script");
        $setMoveIconFrame(10);

        const div = document.createElement("div");
        div.dataset.frame = "20";

        expect(div.style.backgroundColor).toBe("");
        execute(div);
        expect(div.style.backgroundColor).toBe("rgb(54, 146, 240)");
    });
});