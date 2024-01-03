import { execute } from "./TimelineLayerAllElementDisplayNoneService";
import { timelineLayer } from "../../../domain/model/TimelineLayer";

describe("TimelineLayerAllElementDisplayNoneServiceTest", () =>
{
    test("execute test", (): void =>
    {
        timelineLayer.elements.length = 0;

        const node1 = document.createElement("div");
        timelineLayer.elements.push(node1);
        node1.style.display = "";
        node1.classList.add("active");

        const node2 = document.createElement("div");
        timelineLayer.elements.push(node2);
        node2.style.display = "";
        node2.classList.add("active");

        expect(node1.style.display).toBe("");
        expect(node1.classList.contains("active")).toBe(true);
        expect(node2.style.display).toBe("");
        expect(node2.classList.contains("active")).toBe(true);

        execute();

        expect(node1.style.display).toBe("none");
        expect(node1.classList.contains("active")).toBe(false);
        expect(node2.style.display).toBe("none");
        expect(node2.classList.contains("active")).toBe(false);
    });
});