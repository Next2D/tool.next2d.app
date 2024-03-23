import { execute } from "./TimelineLayerControllerActiveExitIconElementService";

describe("TimelineLayerControllerActiveExitIconElementServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        const icon = document.createElement("i");
        div.appendChild(icon);
        icon.classList.add("timeline-exit-icon");
        icon.style.display = "none";

        expect(icon.style.display).toBe("none");
        execute(div);
        expect(icon.style.display).toBe("");
    });
});