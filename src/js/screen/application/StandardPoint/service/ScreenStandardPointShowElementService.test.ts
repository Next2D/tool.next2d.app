import { execute } from "./ScreenStandardPointShowElementService";
import { $SCREEN_STANDARD_POINT_ID } from "../../../../config/ScreenConfig";
import { $setStandardPointState } from "../StandardPointUtil";
import { describe, expect, it } from "vitest";

describe("ScreenStandardPointShowElementServiceTest", () =>
{
    it("execute test", () =>
    {
        const div = document.createElement("div");
        div.id = $SCREEN_STANDARD_POINT_ID;
        document.body.appendChild(div);

        div.style.left = "";
        div.style.top = "";
        div.style.display = "none";
        $setStandardPointState("hide");

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