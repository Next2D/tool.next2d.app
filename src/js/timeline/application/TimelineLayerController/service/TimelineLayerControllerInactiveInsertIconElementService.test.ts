import { execute } from "./TimelineLayerControllerInactiveInsertIconElementService";

describe("TimelineLayerControllerInactiveInsertIconElementServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        const icon = document.createElement("i");
        div.appendChild(icon);
        icon.classList.add("timeline-insert-icon");
        icon.style.display = "";

        expect(icon.style.display).toBe("");
        execute(div);
        expect(icon.style.display).toBe("none");
    });
});