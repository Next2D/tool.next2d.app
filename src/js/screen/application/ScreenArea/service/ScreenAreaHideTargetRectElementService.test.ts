import { execute } from "./ScreenAreaHideTargetRectElementService";
import { $SCREEN_TARGET_RECT_ID } from "../../../../config/ScreenConfig";
import { $getTargetRectState, $setTargetRectState } from "../../ScreenUtil";

describe("ScreenAreaHideTargetRectElementServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        div.id = $SCREEN_TARGET_RECT_ID;
        div.style.display = "";
        document.body.appendChild(div);

        $setTargetRectState("show");

        expect(div.style.display).toBe("");
        expect($getTargetRectState()).toBe("show");
        execute();
        expect(div.style.display).toBe("none");
        expect($getTargetRectState()).toBe("hide");

        div.remove();
    });
});