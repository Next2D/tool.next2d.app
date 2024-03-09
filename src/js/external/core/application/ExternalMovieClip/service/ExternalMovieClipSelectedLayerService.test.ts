import { execute } from "./ExternalMovieClipSelectedLayerService";
import { MovieClip } from "../../../../../core/domain/model/MovieClip";
import { Layer } from "../../../../../core/domain/model/Layer";

describe("ExternalMovieClipSelectedLayerServiceTest", () =>
{
    test("execute test", (): void =>
    {
        const movieClip = new MovieClip({
            "id": 0,
            "name": "test",
            "type": "container",
            "symbol": ""
        });

        const layer = movieClip.getLayer(0) as NonNullable<Layer>;

        expect(movieClip.selectedLayers.length).toBe(0);
        expect(layer.selectedFrame.start).toBe(0);
        expect(layer.selectedFrame.end).toBe(0);

        execute(movieClip, layer, 10);

        expect(movieClip.selectedLayers.length).toBe(1);
        expect(layer.selectedFrame.start).toBe(10);
        expect(layer.selectedFrame.end).toBe(11);
    });
});