import { execute } from "./TimelineHeaderUpdateSoundElementService";
import { $TIMELINE_HEADER_SOUND_INDEX } from "../../../../config/TimelineConfig";
import { $getCurrentWorkSpace, $createWorkSpace } from "../../../../core/application/CoreUtil";

describe("TimelineHeaderUpdateSoundElementServiceeTest", () =>
{
    test("execute test", (): void =>
    {
        const workSpace = $getCurrentWorkSpace() || $createWorkSpace();
        workSpace.scene.setSound(5, []);

        const div = document.createElement("div");

        for (let idx = 0; idx < 5; ++idx) {
            const node = document.createElement("div");
            div.appendChild(node);
        }

        const node = div.children[$TIMELINE_HEADER_SOUND_INDEX];
        node.setAttribute("class", "frame-border-box");

        expect(node.classList.contains("frame-border-box")).toBe(true);
        expect(node.classList.contains("frame-border-box-sound")).toBe(false);

        execute(div, 5);
        expect(node.classList.contains("frame-border-box")).toBe(false);
        expect(node.classList.contains("frame-border-box-sound")).toBe(true);

        execute(div, 6);
        expect(node.classList.contains("frame-border-box")).toBe(true);
        expect(node.classList.contains("frame-border-box-sound")).toBe(false);
    });
});