import { $CONTROLLER_LIBRARY_CHANGE_SCENE_ID } from "../../../../config/ControllerConfig";
import { execute } from "./LibraryMenuEditMovieClipInactiveService";

describe("LibraryMenuEditMovieClipInactiveServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        document.body.appendChild(div);
        div.id = $CONTROLLER_LIBRARY_CHANGE_SCENE_ID;

        expect(div.classList.contains("disabled")).toBe(false);
        execute();
        expect(div.classList.contains("disabled")).toBe(true);

        div.remove();
    });
});