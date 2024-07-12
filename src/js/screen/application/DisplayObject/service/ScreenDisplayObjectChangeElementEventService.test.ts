import { execute } from "./ScreenDisplayObjectChangeElementClassService";
import { $SCREEN_STAGE_AREA_ID } from "../../../../config/ScreenConfig";
import { $getCurrentWorkSpace, $createWorkSpace } from "../../../../core/application/CoreUtil";

describe("ScreenDisplayObjectChangeElementClassServiceTest", () =>
{
    test("execute test", () =>
    {
        const workSpace = $getCurrentWorkSpace() || $createWorkSpace();
        const layer = workSpace.scene.layers[0];

        const parent = document.createElement("div");
        parent.id = $SCREEN_STAGE_AREA_ID;
        document.body.appendChild(parent);

        for (let idx = 0; idx < 10; ++idx) {
            const div = document.createElement("div");
            parent.appendChild(div);
            div.classList.add(`layer-id-${layer.id}`);
        }

        for (let idx = 0; idx < 10; ++idx) {
            const div = parent.children[idx];
            expect(div.classList.contains("disabled")).toBe(false);
        }

        layer.lock = true;
        execute(layer);

        for (let idx = 0; idx < 10; ++idx) {
            const div = parent.children[idx];
            expect(div.classList.contains("disabled")).toBe(true);
        }

        layer.lock = false;
        execute(layer);

        for (let idx = 0; idx < 10; ++idx) {
            const div = parent.children[idx];
            expect(div.classList.contains("disabled")).toBe(false);
        }

        parent.remove();
    });
});