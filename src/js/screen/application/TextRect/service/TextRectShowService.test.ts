import { execute } from "./TextRectShowService";
import { $SCREEN_DRAW_TEXT_ID } from "../../../../config/ScreenConfig";

describe("TextRectShowServiceTest", () =>
{
    test("execute test", () =>
    {
        const parent = document.createElement("div");
        parent.id = $SCREEN_DRAW_TEXT_ID;
        document.body.appendChild(parent);

        parent.style.display = "none";
        expect(parent.style.display).toBe("none");
        execute();
        expect(parent.style.display).toBe("");

        parent.remove();
    });
});