import { execute } from "./TimelineLayerClearSelectedLayerService";
import { timelineLayer } from "../../../domain/model/TimelineLayer";

describe("TimelineLayerClearSelectedLayerServiceTest", () =>
{
    test("execute test", (): void =>
    {
        const div = document.createElement("div");
        document.body.appendChild(div);
        div.setAttribute("class", "active");

        expect(timelineLayer.targetLayers.size).toBe(0);
        expect(div.classList.contains("active")).toBe(true);

        timelineLayer.targetLayers.set(0, div);
        expect(timelineLayer.targetLayers.size).toBe(1);

        execute();

        expect(timelineLayer.targetLayers.size).toBe(0);
        expect(div.classList.contains("active")).toBe(false);
        
        div.remove();
    });
});