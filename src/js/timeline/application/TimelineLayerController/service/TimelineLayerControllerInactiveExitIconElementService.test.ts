import { execute } from "./TimelineLayerControllerInactiveExitIconElementService";
import { describe, expect, it } from "vitest";

describe("TimelineLayerControllerInactiveExitIconElementServiceTest", () =>
{
    it("execute test", () =>
    {
        const div = document.createElement("div");
        const icon = document.createElement("i");
        div.appendChild(icon);
        icon.classList.add("timeline-exit-icon");
        icon.style.display = "";

        expect(icon.style.display).toBe("");
        execute(div);
        expect(icon.style.display).toBe("none");
    });
});