import { $getOffsetLeft, $getOffsetTop } from "../../../util/Global";
import { execute } from "./ScreenStageOffsetUpdate";

describe("ScreenStageOffsetUpdateTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        div.id = "stage";
        document.body.appendChild(div);

        const element: HTMLElement | null = document
            .getElementById("stage");

        if (!element) {
            throw new Error("not found stage element");
        }

        expect($getOffsetLeft()).toBe(0);
        expect($getOffsetTop()).toBe(0);

        execute();

        expect($getOffsetLeft()).toBe(element.offsetLeft);
        expect($getOffsetTop()).toBe(element.offsetTop);

        div.remove();
    });
});