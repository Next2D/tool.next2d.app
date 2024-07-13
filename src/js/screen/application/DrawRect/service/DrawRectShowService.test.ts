import { execute } from "./DrawRectShowService";
import { $SCREEN_DRAW_RECT_ID } from "../../../../config/ScreenConfig";

describe("DrawRectShowServiceTest", () =>
{
    test("execute test", () =>
    {
        const parent = document.createElement("div");
        parent.id = $SCREEN_DRAW_RECT_ID;
        document.body.appendChild(parent);

        parent.style.display = "none";
        expect(parent.style.display).toBe("none");
        execute();
        expect(parent.style.display).toBe("");

        parent.remove();
    });
});