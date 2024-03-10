import { execute } from "./TimelineLayerFrameFirstSelectedService";
import { timelineLayer } from "../../../domain/model/TimelineLayer";
import { Layer } from "../../../../core/domain/model/Layer";

describe("TimelineLayerFrameFirstSelectedServiceTest", () =>
{
    test("execute test", () =>
    {
        const layer1 = new Layer();
        const layer2 = new Layer();

        timelineLayer.selectedFrameObject.start = 10;
        timelineLayer.selectedFrameObject.end = 15;
        timelineLayer.selectedLayers.push(layer1);

        expect(timelineLayer.selectedFrameObject.start).toBe(10);
        expect(timelineLayer.selectedFrameObject.end).toBe(15);
        expect(timelineLayer.selectedLayers[0]).toBe(layer1);

        execute(1, layer2);
        
        expect(timelineLayer.selectedFrameObject.start).toBe(1);
        expect(timelineLayer.selectedFrameObject.end).toBe(1);
        expect(timelineLayer.selectedLayers[0]).toBe(layer2);
    });
});