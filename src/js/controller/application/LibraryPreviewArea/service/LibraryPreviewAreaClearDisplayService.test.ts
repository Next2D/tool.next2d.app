import { execute } from "./LibraryPreviewAreaClearDisplayService";
import { $LIBRARY_PREVIEW_AREA_ID } from "../../../../config/LibraryConfig";

describe("LibraryPreviewAreaClearDisplayServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        div.id = $LIBRARY_PREVIEW_AREA_ID;
        document.body.appendChild(div);

        div.appendChild(document.createElement("div"));

        expect(div.children.length).toBe(1);
        execute("#00ff00");
        expect(div.children.length).toBe(0);

        div.remove();
    });
});