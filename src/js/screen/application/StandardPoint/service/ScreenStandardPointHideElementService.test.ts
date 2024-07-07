import { execute } from "./ScreenStandardPointHideElementService";
import { $SCREEN_STANDARD_POINT_ID } from "../../../../config/ScreenConfig";
import { $setStandardPointState } from "../StandardPointUtil";

describe("ScreenStandardPointHideElementServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        div.id = $SCREEN_STANDARD_POINT_ID;
        document.body.appendChild(div);
        $setStandardPointState("show");

        div.style.display = "";
        expect(div.style.display).toBe("");
        execute();
        expect(div.style.display).toBe("none");

        div.remove();
    });
});