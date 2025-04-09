import { execute } from "./TargetRectMoveElementService";
import { $SCREEN_TARGET_RECT_ID } from "../../../../config/ScreenConfig";
import { describe, expect, it } from "vitest";

describe("TargetRectMoveElementServiceTest", () =>
{
    it("execute test", () =>
    {
        const div = document.createElement("div");
        div.id = $SCREEN_TARGET_RECT_ID;
        div.style.display = "none";
        document.body.appendChild(div);

        expect(div.style.left).toBe("");
        expect(div.style.top).toBe("");

        execute(10, 20);

        expect(div.style.left).toBe("10px");
        expect(div.style.top).toBe("20px");

        div.remove();
    });
});