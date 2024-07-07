import { execute } from "./ScreenStandardPointMoveElementService";
import { $SCREEN_STANDARD_POINT_ID } from "../../../../config/ScreenConfig";
import { $setStandardPointState } from "../StandardPointUtil";

describe("ScreenStandardPointMoveElementServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        div.id = $SCREEN_STANDARD_POINT_ID;
        document.body.appendChild(div);

        div.style.left = "";
        div.style.top = "";

        expect(div.style.left).toBe("");
        expect(div.style.top).toBe("");
        execute(10, 20);
        expect(div.style.left).toBe("");
        expect(div.style.top).toBe("");

        $setStandardPointState("show");
        execute(10, 20);
        expect(div.style.left).toBe("10px");
        expect(div.style.top).toBe("20px");

        div.remove();
    });
});