import { execute } from "./MovieClipClearSelectedLayerService";
import { MovieClip } from "../../../../core/domain/model/MovieClip";
import { Layer } from "../../../../core/domain/model/Layer";

describe("MovieClipClearSelectedLayerServiceTest", () =>
{
    test("execute test", () =>
    {
        const movieClip = new MovieClip({
            "id": 0,
            "name": "test",
            "type": "container",
            "symbol": ""
        });

        const layer1 = new Layer();
        layer1.selectedFrame.start = 3;
        layer1.selectedFrame.end   = 4;
        movieClip.layers.push(layer1);
        movieClip.selectedLayers.push(layer1);
        expect(layer1.selectedFrame.start).toBe(3);
        expect(layer1.selectedFrame.end).toBe(4);

        const layer2 = new Layer();
        layer2.selectedFrame.start = 3;
        layer2.selectedFrame.end   = 4;
        movieClip.layers.push(layer2);
        movieClip.selectedLayers.push(layer2);
        expect(layer1.selectedFrame.start).toBe(3);
        expect(layer1.selectedFrame.end).toBe(4);

        expect(movieClip.selectedLayers.length).toBe(2);
        execute(movieClip);
        expect(movieClip.selectedLayers.length).toBe(0);

        expect(layer1.selectedFrame.start).toBe(0);
        expect(layer1.selectedFrame.end).toBe(0);
        expect(layer1.selectedFrame.start).toBe(0);
        expect(layer1.selectedFrame.end).toBe(0);
    });
});