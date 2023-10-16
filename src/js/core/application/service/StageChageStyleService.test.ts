import { execute } from "./StageChageStyleService";

describe("StageChageStyleServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        div.id = "stage";
        document.body.appendChild(div);

        const element: HTMLElement | null = document.getElementById("stage");
        if (!element) {
            throw new Error("not found stage element");
        }

        expect(element.style.width).toBe("");
        expect(element.style.height).toBe("");
        expect(element.style.backgroundColor).toBe("");

        const stageMock = {
            "width": 100,
            "height": 200,
            "bgColor": "#ff00ff"
        };

        execute(stageMock);
        expect(element.style.width).toBe("100px");
        expect(element.style.height).toBe("200px");
        expect(element.style.backgroundColor).toBe("rgb(255, 0, 255)");

        div.remove();
    });
});