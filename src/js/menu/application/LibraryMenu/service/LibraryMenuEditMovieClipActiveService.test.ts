import { $CONTROLLER_LIBRARY_CHANGE_SCENE_ID } from "../../../../config/ControllerConfig";
import { execute } from "./LibraryMenuEditMovieClipActiveService";

describe("LibraryMenuEditMovieClipActiveServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        document.body.appendChild(div);
        div.id = $CONTROLLER_LIBRARY_CHANGE_SCENE_ID;
        div.classList.add("disabled");

        expect(div.classList.contains("disabled")).toBe(true);
        execute();
        expect(div.classList.contains("disabled")).toBe(false);

        div.remove();
    });
});