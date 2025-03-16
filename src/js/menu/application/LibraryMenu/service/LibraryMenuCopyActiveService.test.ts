import { $CONTROLLER_LIBRARY_MENU_COPY_ID } from "../../../../config/ControllerConfig";
import { execute } from "./LibraryMenuCopyActiveService";
import { describe, expect, it } from "vitest";

describe("LibraryMenuCopyActiveServiceTest", () =>
{
    it("execute test", () =>
    {
        const div = document.createElement("div");
        document.body.appendChild(div);
        div.id = $CONTROLLER_LIBRARY_MENU_COPY_ID;
        div.classList.add("disabled");

        expect(div.classList.contains("disabled")).toBe(true);
        execute();
        expect(div.classList.contains("disabled")).toBe(false);

        div.remove();
    });
});