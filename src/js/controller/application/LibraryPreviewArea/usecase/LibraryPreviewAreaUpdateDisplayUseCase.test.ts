import { execute } from "./LibraryPreviewAreaUpdateDisplayUseCase";
import { $LIBRARY_PREVIEW_AREA_ID } from "../../../../config/LibraryConfig";
import { Shape } from "../../../../core/domain/model/Shape";
import { libraryArea } from "../../../../controller/domain/model/LibraryArea";
import { describe, expect, it } from "vitest";

describe("LibraryPreviewAreaUpdateDisplayUseCase Test", () =>
{
    it("execute test", async () =>
    {
        const div = document.createElement("div");
        div.id = $LIBRARY_PREVIEW_AREA_ID;
        document.body.appendChild(div);

        const shape = new Shape({
            id: 1,
            type: "shape",
            name: "test",
        });
        libraryArea.selectedId = 0;

        expect(div.children.length).toBe(0);
        expect(libraryArea.selectedId).toBe(0);

        await execute(shape);

        expect(div.children.length).toBe(1);
        expect(libraryArea.selectedId).toBe(1);

        div.remove();
    });
});