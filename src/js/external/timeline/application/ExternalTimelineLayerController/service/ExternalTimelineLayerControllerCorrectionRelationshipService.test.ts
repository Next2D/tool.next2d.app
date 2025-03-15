import { execute } from "./ExternalTimelineLayerControllerCorrectionRelationshipService";
import { Layer } from "../../../../../core/domain/model/Layer";
import { MovieClip } from "../../../../../core/domain/model/MovieClip";
import { describe, expect, it } from "vitest";

describe("ExternalTimelineLayerControllerCorrectionRelationshipServiceTest", () =>
{
    it("execute test", () =>
    {
        const movieClip = new MovieClip({
            "id": 0,
            "name": "MovieClip_01",
            "type": "container"
        });

        const parentLayer = movieClip.layers.splice(0, 1)[0];

        for (let idx = 1; idx <= 5; ++idx) {
            const layer = new Layer();
            if (idx >= 2 && 4 >= idx) {
                layer.parentId = parentLayer.id;
            }
            movieClip.setLayer(layer, idx);
        }

        // 一番下に移動
        movieClip.layers.push(parentLayer);

        const count = execute(movieClip, parentLayer, 1);
        expect(count).toBe(3);
        expect(movieClip.layers[2]).toBe(parentLayer);
    });
});