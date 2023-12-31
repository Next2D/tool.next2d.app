import { execute } from "./TimelineLayerFrameActiveElementService";
import { timelineLayer } from "../../../domain/model/TimelineLayer";
import { $getCurrentWorkSpace, $createWorkSpace } from "../../../../core/application/CoreUtil";

describe("TimelineLayerFrameActiveElementServiceTest", () =>
{
    test("execute test", () =>
    {
        const workSpace = $getCurrentWorkSpace() || $createWorkSpace();

        const div = document.createElement("div");
        div.dataset.layerIndex = "0";
        div.dataset.frame = "3";

        const targetLayers = timelineLayer.targetLayers;
        expect(targetLayers.size).toBe(0);
        expect(targetLayers.has(0)).toBe(false);
        expect(div.classList.contains("frame-active")).toBe(false);

        execute(div);

        expect(targetLayers.size).toBe(1);
        expect(targetLayers.has(0)).toBe(true);
        expect(div.classList.contains("frame-active")).toBe(true);
    });
});