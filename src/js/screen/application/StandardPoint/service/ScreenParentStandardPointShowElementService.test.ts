import { execute } from "./ScreenParentStandardPointShowElementService";
import { $SCREEN_PARENT_STANDARD_POINT_ID } from "../../../../config/ScreenConfig";
import { $setParentStandardPointState } from "../StandardPointUtil";
import { describe, expect, it } from "vitest";

describe("ScreenParentStandardPointShowElementServiceTest", () =>
{
    it("execute test", () =>
    {
        const div = document.createElement("div");
        div.id = $SCREEN_PARENT_STANDARD_POINT_ID;
        document.body.appendChild(div);

        div.style.left = "";
        div.style.top = "";
        div.style.display = "none";
        $setParentStandardPointState("hide");

        expect(div.style.left).toBe("");
        expect(div.style.top).toBe("");
        expect(div.style.display).toBe("none");
        execute(10 + 6, 20 + 6);

        expect(div.style.left).toBe("10px");
        expect(div.style.top).toBe("20px");
        expect(div.style.display).toBe("");

        div.remove();
    });
});