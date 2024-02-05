import { execute } from "./LibraryAreaUpdateFolderStateService";
import { Folder } from "../../../../core/domain/model/Folder";

describe("LibraryAreaUpdateFolderStateServiceTest", () =>
{
    test("execute test", () =>
    {
        const folder = new Folder({
            "id": 1,
            "type": "folder",
            "name": "Folder_1",
            "mode": "close"
        });

        const div = document.createElement("div");
        document.body.appendChild(div);
        div.id = "library-child-id-1";

        const icon1 = document.createElement("i");
        icon1.classList.add("open");
        div.appendChild(icon1);

        const icon2 = document.createElement("i");
        icon2.classList.add("library-type-folder-open");
        div.appendChild(icon2);

        expect(icon1.classList.contains("open")).toBe(true);
        expect(icon1.classList.contains("close")).toBe(false);
        expect(icon2.classList.contains("library-type-folder-open")).toBe(true);
        expect(icon2.classList.contains("library-type-folder-close")).toBe(false);

        execute(folder);

        expect(icon1.classList.contains("open")).toBe(false);
        expect(icon1.classList.contains("close")).toBe(true);
        expect(icon2.classList.contains("library-type-folder-open")).toBe(false);
        expect(icon2.classList.contains("library-type-folder-close")).toBe(true);

        div.remove();
    });
});