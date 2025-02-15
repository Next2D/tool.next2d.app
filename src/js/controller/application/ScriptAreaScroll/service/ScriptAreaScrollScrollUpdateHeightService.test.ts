import { execute } from "./ScriptAreaScrollUpdateHeightService";
import {
    $CONTROLLER_JAVASCRIPT_INTERNAL_LIST_BOX_ID,
    $CONTROLLER_JAVASCRIPT_INTERNAL_LIST_SCROLL_AREA_ID,
    $CONTROLLER_JAVASCRIPT_INTERNAL_LIST_SCROLL_BAR_ID
} from "../../../../config/ControllerScriptAreaConfig";
import { describe, expect, it } from "vitest";

describe("ScriptAreaScrollUpdateHeightServiceTest", () =>
{
    it("execute test", () =>
    {
        const scrollAreaElement = document.createElement("div");
        document.body.appendChild(scrollAreaElement);
        scrollAreaElement.id = $CONTROLLER_JAVASCRIPT_INTERNAL_LIST_SCROLL_AREA_ID;

        const bodyElement = document.createElement("div");
        document.body.appendChild(bodyElement);
        bodyElement.id = $CONTROLLER_JAVASCRIPT_INTERNAL_LIST_BOX_ID;

        const scrollBarElement = document.createElement("div");
        document.body.appendChild(scrollBarElement);
        scrollBarElement.id = $CONTROLLER_JAVASCRIPT_INTERNAL_LIST_SCROLL_BAR_ID;

        expect(scrollBarElement.style.display).toBe("");

        execute();

        expect(scrollBarElement.style.display).toBe("none");

        scrollAreaElement.remove();
        bodyElement.remove();
        scrollBarElement.remove();
    });
});