import { execute } from "./TimelineLayerDeactivatedElementService";
import { timelineLayer } from "../../../domain/model/TimelineLayer";
import { $getCurrentWorkSpace, $createWorkSpace } from "../../../../core/application/CoreUtil";
import type { MovieClip } from "../../../../core/domain/model/MovieClip";
import type { Layer } from "../../../../core/domain/model/Layer";

describe("TimelineLayerDeactivatedElementServiceTest", () =>
{
    test("execute test", (): void =>
    {
        timelineLayer.elements.length = 0;

        const node1 = document.createElement("div");
        timelineLayer.elements.push(node1);
        node1.classList.add("active");

        const parent = document.createElement("div");
        node1.appendChild(parent);

        const node1_child1 = document.createElement("div");
        node1_child1.classList.add("frame-active");
        const node1_child2 = document.createElement("div");
        node1_child2.classList.add("frame-active");
        parent.appendChild(node1_child1);
        parent.appendChild(node1_child2);

        const node2 = document.createElement("div");
        timelineLayer.elements.push(node2);
        node2.classList.add("active");

        expect(node1.classList.contains("active")).toBe(true);
        expect(node2.classList.contains("active")).toBe(true);
        expect(node1_child1.classList.contains("frame-active")).toBe(true);
        expect(node1_child2.classList.contains("frame-active")).toBe(true);

        const workSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const scene: MovieClip = workSpace.scene;

        const layer = scene.getLayer(0) as NonNullable<Layer>;
        layer.selectedFrame.start = 1;
        layer.selectedFrame.end   = 3;

        execute(layer);

        expect(node1.classList.contains("active")).toBe(false);
        expect(node2.classList.contains("active")).toBe(true);
        expect(node1_child1.classList.contains("frame-active")).toBe(false);
        expect(node1_child2.classList.contains("frame-active")).toBe(false);
    });
});