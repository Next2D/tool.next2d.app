import { execute } from "./LibraryAreaAllClearElementService";
import { libraryArea } from "../../../domain/model/LibraryArea";
import { describe, expect, it } from "vitest";

describe("LibraryAreaAllClearElementServiceTest", () =>
{
    it("execute test", () =>
    {
        const div = document.createElement("div");
        document.body.appendChild(div);
        div.id = "library-child-id-1";
        div.classList.add("active");

        libraryArea.selectedIds.length = 0;
        libraryArea.selectedIds.push(1);

        expect(div.classList.contains("active")).toBe(true);
        execute();
        expect(div.classList.contains("active")).toBe(false);

        div.remove();
    });
});