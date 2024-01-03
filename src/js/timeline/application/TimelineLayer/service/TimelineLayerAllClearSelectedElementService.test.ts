import { execute } from "./TimelineLayerAllClearSelectedElementService";
import { timelineLayer } from "../../../domain/model/TimelineLayer";
import { $getCurrentWorkSpace, $createWorkSpace } from "../../../../core/application/CoreUtil";

describe("TimelineLayerAllClearSelectedElementServiceTest", () =>
{
    test("execute test", (): void =>
    {
        const workSpace = $getCurrentWorkSpace() || $createWorkSpace();

        timelineLayer.targetLayers.set(0, [1, 2]);

        const layerElement = document.createElement("div");
        layerElement.setAttribute("class", "active");

        timelineLayer.elements.length = 0;
        timelineLayer.elements.push(layerElement);

        const frameElement = document.createElement("div");
        layerElement.appendChild(frameElement);

        const frameElement1 = document.createElement("div");
        frameElement.appendChild(frameElement1);

        frameElement1.setAttribute("class", "frame-active");

        const frameElement2 = document.createElement("div");
        frameElement.appendChild(frameElement2);

        frameElement2.setAttribute("class", "frame-active");

        expect(timelineLayer.targetLayers.size).toBe(1);
        expect(layerElement.classList.contains("active")).toBe(true);
        expect(frameElement1.classList.contains("frame-active")).toBe(true);
        expect(frameElement2.classList.contains("frame-active")).toBe(true);

        execute();

        expect(layerElement.classList.contains("active")).toBe(false);
        expect(frameElement1.classList.contains("frame-active")).toBe(false);
        expect(frameElement2.classList.contains("frame-active")).toBe(false);
    });
});