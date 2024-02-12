import { $CONTROLLER_LIBRARY_MENU_EXPORT_ID } from "../../../../config/ControllerConfig";
import { execute } from "./LibraryMenuExportInactiveService";

describe("LibraryMenuExportInactiveServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        document.body.appendChild(div);
        div.id = $CONTROLLER_LIBRARY_MENU_EXPORT_ID;

        expect(div.classList.contains("disabled")).toBe(false);
        execute();
        expect(div.classList.contains("disabled")).toBe(true);

        div.remove();
    });
});