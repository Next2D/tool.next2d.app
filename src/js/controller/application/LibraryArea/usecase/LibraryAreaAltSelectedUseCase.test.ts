import { execute } from "./LibraryAreaAltSelectedUseCase";
import { libraryArea } from "../../../../controller/domain/model/LibraryArea";
import { describe, expect, it } from "vitest";

describe("LibraryAreaAltSelectedUseCase Test", () =>
{
    it("execute test case1", () =>
    {
        libraryArea.selectedIds.length = 0;

        expect(libraryArea.selectedIds.length).toBe(0);
        execute(1);
        expect(libraryArea.selectedIds.length).toBe(1);
        expect(libraryArea.selectedIds[0]).toBe(1);
    });

    it("execute test case2", () =>
    {
        libraryArea.selectedIds.length = 0;
        libraryArea.selectedIds.push(1, 2, 3);

        expect(libraryArea.selectedIds.length).toBe(3);
        execute(2);
        expect(libraryArea.selectedIds.length).toBe(2);
        expect(libraryArea.selectedIds[0]).toBe(1);
        expect(libraryArea.selectedIds[1]).toBe(3);
    });
});