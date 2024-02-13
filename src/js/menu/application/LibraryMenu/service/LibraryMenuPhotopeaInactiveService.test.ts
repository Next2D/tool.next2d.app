import { $CONTROLLER_LIBRARY_PHOTOPEA_ID } from "../../../../config/ControllerConfig";
import { execute } from "./LibraryMenuPhotopeaInactiveService";

describe("LibraryMenuPhotopeaInactiveServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        document.body.appendChild(div);
        div.id = $CONTROLLER_LIBRARY_PHOTOPEA_ID;

        expect(div.classList.contains("disabled")).toBe(false);
        execute();
        expect(div.classList.contains("disabled")).toBe(true);

        div.remove();
    });
});