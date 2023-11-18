import {
    $getScreenOffsetLeft,
    $getScreenOffsetTop
} from "../../../../global/GlobalUtil";
import { execute } from "./ScreenStageOffsetUpdateService";

describe("ScreenStageOffsetUpdateServiceTest", () =>
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

        expect($getScreenOffsetLeft()).toBe(0);
        expect($getScreenOffsetTop()).toBe(0);

        execute();

        expect($getScreenOffsetLeft()).toBe(element.offsetLeft);
        expect($getScreenOffsetTop()).toBe(element.offsetTop);

        div.remove();
    });
});