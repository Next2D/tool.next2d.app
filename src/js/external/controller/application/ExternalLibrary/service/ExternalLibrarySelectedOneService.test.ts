import { execute } from "./ExternalLibrarySelectedOneService";
import { libraryArea } from "../../../../../controller/domain/model/LibraryArea";
import { describe, expect, it } from "vitest";

describe("ExternalLibrarySelectedOneServiceTest", () =>
{
    it("execute test", () =>
    {
        libraryArea.selectedIds.length = 0;
        libraryArea.selectedIds.push(10);

        expect(libraryArea.selectedIds.length).toBe(1);
        expect(libraryArea.selectedIds[0]).toBe(10);
        execute(1);
        expect(libraryArea.selectedIds.length).toBe(1);
        expect(libraryArea.selectedIds[0]).toBe(1);
    });
});