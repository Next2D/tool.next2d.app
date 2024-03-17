import { execute } from "./TimelineLayerAllElementRemoveMoveTargetService";
import { timelineLayer } from "../../../domain/model/TimelineLayer";

describe("TimelineLayerAllElementRemoveMoveTargetServiceTest", () =>
{
    test("execute test", (): void =>
    {
        timelineLayer.elements.length = 0;

        const node1 = document.createElement("div");
        timelineLayer.elements.push(node1);
        node1.classList.add("move-target");

        const node2 = document.createElement("div");
        timelineLayer.elements.push(node2);
        node2.classList.add("move-target");

        expect(node1.classList.contains("move-target")).toBe(true);
        expect(node2.classList.contains("move-target")).toBe(true);

        execute();

        expect(node1.classList.contains("move-target")).toBe(false);
        expect(node2.classList.contains("move-target")).toBe(false);
    });
});