import { execute } from "./ScreenStageAreaUpdateSizeService";

describe("ScreenStageAreaUpdateSizeServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        div.id = "stage-area";
        document.body.appendChild(div);

        const element: HTMLElement | null = document
            .getElementById("stage-area");

        if (!element) {
            throw new Error("not found stage-area element");
        }

        expect(element.style.width).toBe("");
        expect(element.style.height).toBe("");

        const stageMock = {
            "width": 100,
            "height": 200
        };
        execute(stageMock);

        expect(element.style.width).toBe("100px");
        expect(element.style.height).toBe("200px");

        div.remove();
    });
});