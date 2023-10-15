import { execute } from "./LibraryPreviewAreaChangeColor";

describe("LibraryPreviewAreaChangeColorTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        div.id = "library-preview-area";
        document.body.appendChild(div);

        const element: HTMLElement | null = document
            .getElementById("library-preview-area");

        if (!element) {
            throw new Error("not found library-preview-area element");
        }

        expect(element.style.backgroundColor).toBe("");

        execute("#00ff00");
        expect(element.style.backgroundColor).toBe("rgb(0, 255, 0)");

        div.remove();
    });
});