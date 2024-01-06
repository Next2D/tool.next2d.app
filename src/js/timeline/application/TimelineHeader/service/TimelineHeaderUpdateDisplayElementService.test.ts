import { execute } from "./TimelineHeaderUpdateDisplayElementService";
import { $TIMELINE_HEADER_DISPLAY_INDEX } from "../../../../config/TimelineConfig";

describe("TimelineHeaderUpdateDisplayElementServiceTest", () =>
{
    test("execute test", (): void =>
    {
        const div = document.createElement("div");

        for (let idx = 0; idx < 5; ++idx) {
            const node = document.createElement("div");
            div.appendChild(node);
        }

        const node = div.children[$TIMELINE_HEADER_DISPLAY_INDEX];
        node.setAttribute("class", "frame-border");

        expect(div.textContent).toBe("");
        expect(node.classList.contains("frame-border")).toBe(true);
        expect(node.classList.contains("frame-border-end")).toBe(false);

        execute(div, 5, 5);
        expect(div.textContent).toBe("1s");
        expect(node.classList.contains("frame-border")).toBe(false);
        expect(node.classList.contains("frame-border-end")).toBe(true);

        execute(div, 6, 5);
        expect(div.textContent).toBe("");
        expect(node.classList.contains("frame-border")).toBe(true);
        expect(node.classList.contains("frame-border-end")).toBe(false);
    });
});