import { execute } from "./TimelineToolDisableAllGetCurrentModeService";
import { $createWorkSpace } from "../../../../../../core/application/CoreUtil";
import { MovieClip } from "../../../../../../core/domain/model/MovieClip";

describe("TimelineToolDisableAllGetCurrentModeServiceTest", () =>
{
    test("execute test", () =>
    {
        const scene: MovieClip = $createWorkSpace().scene;

        scene.setLayer(scene.createLayer(), scene.layers.length);
        scene.setLayer(scene.createLayer(), scene.layers.length);
        scene.setLayer(scene.createLayer(), scene.layers.length);
        expect(execute()).toBe(true);

        for (let idx = 0; idx < scene.layers.length; ++idx) {
            const layer = scene.layers[idx];
            layer.disable = true;
        }
        expect(execute()).toBe(false);

        for (let idx = 0; idx < scene.layers.length; ++idx) {
            const layer = scene.layers[idx];
            layer.disable = false;
        }

        const layer = scene.layers[0];
        layer.disable = true;

        expect(execute()).toBe(true);
    });
});