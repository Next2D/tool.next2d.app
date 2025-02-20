import { execute } from "./LibraryAreaSelectedClearUseCase";
import { libraryArea } from "../../../../controller/domain/model/LibraryArea";
import { describe, expect, it } from "vitest";

describe("LibraryAreaSelectedClearUseCase Test", () =>
{
    it("execute test", () =>
    {
        libraryArea.selectedId = 10;
        libraryArea.selectedIds.push(10);

        expect(libraryArea.selectedId).toBe(10);
        expect(libraryArea.selectedIds.length).toBe(1);
        execute();
        expect(libraryArea.selectedId).toBe(-1);
        expect(libraryArea.selectedIds.length).toBe(0);
    });
});