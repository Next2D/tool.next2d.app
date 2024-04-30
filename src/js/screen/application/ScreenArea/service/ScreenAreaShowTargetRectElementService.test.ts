import { execute } from "./ScreenAreaShowTargetRectElementService";
import { $SCREEN_TARGET_RECT_ID } from "../../../../config/ScreenConfig";
import { $getTargetRectState, $setTargetRectState } from "../../ScreenUtil";

describe("ScreenAreaShowTargetRectElementServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        div.id = $SCREEN_TARGET_RECT_ID;
        div.style.display = "none";
        document.body.appendChild(div);

        $setTargetRectState("hide");

        expect(div.style.display).toBe("none");
        expect(div.classList.contains("arrow")).toBe(false);
        expect($getTargetRectState()).toBe("hide");

        execute(0, 0, 100, 100, "arrow");

        expect(div.style.display).toBe("");
        expect(div.classList.contains("arrow")).toBe(true);
        expect($getTargetRectState()).toBe("show");

        div.remove();
    });
});