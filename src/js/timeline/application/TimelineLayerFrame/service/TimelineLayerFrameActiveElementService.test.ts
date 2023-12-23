import { execute } from "./TimelineLayerFrameActiveElementService";
import { timelineLayer } from "../../../domain/model/TimelineLayer";

describe("TimelineLayerFrameActiveElementServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        div.dataset.layerId = "0";

        const targetFrames = timelineLayer.targetFrames;
        expect(targetFrames.size).toBe(0);
        expect(targetFrames.has(0)).toBe(false);
        expect(div.classList.contains("frame-active")).toBe(false);

        execute(div);

        expect(targetFrames.size).toBe(1);
        expect(targetFrames.has(0)).toBe(true);
        expect(div.classList.contains("frame-active")).toBe(true);
    });
});