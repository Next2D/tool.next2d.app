import { execute } from "./PluginAreaScrollUpdateHeightService";
import {
    $PLUGIN_LIST_BOX_BODY_ID,
    $PLUGIN_LIST_SCROLL_AREA_ID,
    $PLUGIN_LIST_SCROLL_BAR_ID
} from "../../../../config/PluginAreaConfig";
import { describe, expect, it } from "vitest";

describe("PluginAreaScrollUpdateHeightServiceTest", () =>
{
    it("execute test", () =>
    {
        const scrollAreaElement = document.createElement("div");
        document.body.appendChild(scrollAreaElement);
        scrollAreaElement.id = $PLUGIN_LIST_SCROLL_AREA_ID;

        const bodyElement = document.createElement("div");
        document.body.appendChild(bodyElement);
        bodyElement.id = $PLUGIN_LIST_BOX_BODY_ID;

        const scrollBarElement = document.createElement("div");
        document.body.appendChild(scrollBarElement);
        scrollBarElement.id = $PLUGIN_LIST_SCROLL_BAR_ID;

        expect(scrollBarElement.style.display).toBe("");

        execute();

        expect(scrollBarElement.style.display).toBe("none");

        scrollAreaElement.remove();
        bodyElement.remove();
        scrollBarElement.remove();
    });
});