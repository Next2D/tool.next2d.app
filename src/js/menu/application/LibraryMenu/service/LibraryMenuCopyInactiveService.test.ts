import { $CONTROLLER_LIBRARY_MENU_COPY_ID } from "../../../../config/ControllerConfig";
import { execute } from "./LibraryMenuCopyInactiveService";

describe("LibraryMenuCopyInactiveServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        document.body.appendChild(div);
        div.id = $CONTROLLER_LIBRARY_MENU_COPY_ID;

        expect(div.classList.contains("disabled")).toBe(false);
        execute();
        expect(div.classList.contains("disabled")).toBe(true);

        div.remove();
    });
});