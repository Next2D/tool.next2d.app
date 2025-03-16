import { execute } from "./LibraryMenuAddNewFolderService";
import { describe, expect, it } from "vitest";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";
import type { Folder } from "../../../../core/domain/model/Folder";
import { $FOLDER_TYPE } from "../../../../config/InstanceConfig";

describe("LibraryMenuAddNewFolderService Test", () =>
{
    it("test case", async () =>
    {
        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();

        expect(workSpace.libraries.size).toBe(1);
        await execute();
        expect(workSpace.libraries.size).toBe(2);

        const id = workSpace.nextLibraryId - 1;
        const folder = workSpace.libraries.get(id) as Folder;

        expect(folder.type).toBe($FOLDER_TYPE);
        workSpace.libraries.delete(id);
    });
});