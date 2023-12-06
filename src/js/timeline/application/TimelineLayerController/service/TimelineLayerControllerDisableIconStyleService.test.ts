import { execute } from "./TimelineLayerControllerDisableIconStyleService";
import { $createWorkSpace } from "../../../../core/application/CoreUtil";

describe("TimelineLayerControllerDisableIconStyleServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        div.setAttribute("class", "icon-disable");
        div.id = "layer-disable-icon-0";
        document.body.appendChild(div);

        const workSpace = $createWorkSpace();
        const layer = workSpace.scene.getLayer(0);

        expect(layer.disable).toBe(false);
        expect(div.classList.contains("icon-disable")).toBe(true);
        expect(div.classList.contains("icon-active")).toBe(false);

        execute(0, true);

        expect(layer.disable).toBe(true);
        expect(div.classList.contains("icon-disable")).toBe(false);
        expect(div.classList.contains("icon-active")).toBe(true);

        execute(0, false);

        expect(layer.disable).toBe(false);
        expect(div.classList.contains("icon-disable")).toBe(true);
        expect(div.classList.contains("icon-active")).toBe(false);

        div.remove();
    });
});