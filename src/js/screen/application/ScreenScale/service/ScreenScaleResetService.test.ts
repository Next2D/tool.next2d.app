import { $getZoom, $setZoom } from "../../../../util/Global";
import { execute } from "./ScreenScaleResetService";

describe("ScreenScaleResetServiceTest", () =>
{
    test("execute test", () =>
    {
        const input = document.createElement("input");
        input.id = "screen-scale";
        input.type = "number";
        document.body.appendChild(input);

        const element: HTMLInputElement | null = document
            .getElementById("screen-scale") as HTMLInputElement;

        if (!element) {
            throw new Error("not found screen-scale element");
        }

        expect(element.value).toBe("");
        expect($getZoom()).toBe(1);

        $setZoom(2);
        expect($getZoom()).toBe(2);

        execute();
        expect(element.value).toBe("100");
        expect($getZoom()).toBe(1);

        input.remove();
    });
});