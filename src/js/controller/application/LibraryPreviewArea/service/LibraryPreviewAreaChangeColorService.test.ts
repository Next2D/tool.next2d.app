import { execute } from "./LibraryPreviewAreaChangeColorService";
import { $LIBRARY_PREVIEW_AREA_ID } from "../../../../config/LibraryConfig";

describe("LibraryPreviewAreaChangeColorServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        div.id = $LIBRARY_PREVIEW_AREA_ID;
        document.body.appendChild(div);

        const element: HTMLElement | null = document
            .getElementById($LIBRARY_PREVIEW_AREA_ID);

        if (!element) {
            throw new Error("not found library-preview-area element");
        }

        expect(element.style.backgroundColor).toBe("");
        execute("#00ff00");
        expect(element.style.backgroundColor).toBe("rgb(0, 255, 0)");

        div.remove();
    });
});