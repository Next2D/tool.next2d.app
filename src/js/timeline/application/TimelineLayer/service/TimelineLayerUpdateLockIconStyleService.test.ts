import { execute } from "./TimelineLayerUpdateLockIconStyleService";
import { $createWorkSpace } from "../../../../core/application/CoreUtil";

describe("TimelineLayerUpdateLockIconStyleServiceTest", () =>
{
    test("execute test", async () =>
    {
        const div = document.createElement("div");
        div.setAttribute("class", "icon-disable");
        div.id = "layer-lock-icon-0";
        document.body.appendChild(div);

        const workSpace = $createWorkSpace();
        const layer = workSpace.scene.getLayer(0);

        expect(layer.lock).toBe(false);
        expect(div.classList.contains("icon-disable")).toBe(true);
        expect(div.classList.contains("icon-active")).toBe(false);

        execute(0, true);

        expect(layer.lock).toBe(true);
        expect(div.classList.contains("icon-disable")).toBe(false);
        expect(div.classList.contains("icon-active")).toBe(true);

        execute(0, false);

        expect(layer.lock).toBe(false);
        expect(div.classList.contains("icon-disable")).toBe(true);
        expect(div.classList.contains("icon-active")).toBe(false);

        div.remove();
    });
});