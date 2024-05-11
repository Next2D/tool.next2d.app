import { execute } from "./ScreenAreaMoveDisplayObjectElementService";
import { $SCREEN_STAGE_AREA_ID } from "../../../../config/ScreenConfig";
import { Character } from "../../../../core/domain/model/Character";
import { $getCurrentWorkSpace, $createWorkSpace } from "../../../../core/application/CoreUtil";

describe("ScreenAreaMoveDisplayObjectElementServiceTest", () =>
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

        const node = parent.children[1] as HTMLElement;
        node.style.left = "15px";
        node.style.top  = "10px";

        const character = new Character();
        character.depth = 1;
        character.x = 100;
        character.y = 50;

        expect(node.style.left ).toBe("15px");
        expect(node.style.top).toBe("10px");

        execute(layer, character);

        expect(node.style.left ).toBe("100px");
        expect(node.style.top).toBe("50px");

        parent.remove();
    });
});