import { $CONTROLLER_LIBRARY_PHOTOPEA_ID } from "../../../../config/ControllerConfig";
import { execute } from "./LibraryMenuPhotopeaActiveService";

describe("LibraryMenuPhotopeaActiveServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        document.body.appendChild(div);
        div.id = $CONTROLLER_LIBRARY_PHOTOPEA_ID;
        div.classList.add("disabled");

        expect(div.classList.contains("disabled")).toBe(true);
        execute();
        expect(div.classList.contains("disabled")).toBe(false);

        div.remove();
    });
});