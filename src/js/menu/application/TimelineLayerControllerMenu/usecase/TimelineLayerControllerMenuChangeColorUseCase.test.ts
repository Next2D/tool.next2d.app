import { execute } from "./TimelineLayerControllerMenuChangeColorUseCase";
import { describe, expect, it } from "vitest";
import { $createWorkSpace, $getCurrentWorkSpace } from "../../../../core/application/CoreUtil";
import type { WorkSpace } from "../../../../core/domain/model/WorkSpace";

describe("TimelineLayerControllerMenuUpdateIconStyleServiceTest", () =>
{
    it("execute test", async () =>
    {
        const workSpace: WorkSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const movieClip = workSpace.scene;

        const layer = movieClip.layers[0];
        layer.color = "#0000ff";
        expect(layer.color).toBe("#0000ff");

        movieClip.selectedLayers.length = 0;
        movieClip.selectedLayers.push(layer);

        const input = document.createElement("input");
        input.type  = "color";
        input.value = "#ff0000"; // 赤色

        const mockEvent = {
            "target": input
        } as unknown as Event;

        await execute(mockEvent);

        expect(layer.color).toBe("#ff0000");
    });
});