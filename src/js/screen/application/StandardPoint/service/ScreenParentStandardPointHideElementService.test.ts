import { execute } from "./ScreenParentStandardPointHideElementService";
import { $SCREEN_PARENT_STANDARD_POINT_ID } from "../../../../config/ScreenConfig";
import { $setParentStandardPointState } from "../StandardPointUtil";
import { describe, expect, it } from "vitest";

describe("ScreenParentStandardPointHideElementServiceTest", () =>
{
    it("execute test", () =>
    {
        const div = document.createElement("div");
        div.id = $SCREEN_PARENT_STANDARD_POINT_ID;
        document.body.appendChild(div);
        $setParentStandardPointState("show");

        div.style.display = "";
        expect(div.style.display).toBe("");
        execute();
        expect(div.style.display).toBe("none");

        div.remove();
    });
});