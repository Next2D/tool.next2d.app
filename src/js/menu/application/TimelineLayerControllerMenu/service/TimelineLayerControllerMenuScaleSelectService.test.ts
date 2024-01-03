import { $TIMELINE_CONTROLLER_LAYER_SCALE_ID } from "../../../../config/TimelineLayerControllerMenuConfig";
import { $TIMELINE_DEFAULT_FRAME_HEIGHT_SIZE } from "../../../../config/TimelineConfig";
import { execute } from "./TimelineLayerControllerMenuScaleSelectService";
import { $getCurrentWorkSpace, $createWorkSpace } from "../../../../core/application/CoreUtil";

describe("TimelineLayerControllerMenuScaleSelectServiceTest", () =>
{
    test("execute test", () =>
    {
        const workSpace = $getCurrentWorkSpace() || $createWorkSpace();

        const layerElement = document.createElement("div");
        layerElement.dataset.layerIndex = "0";

        const select = document.createElement("select");
        select.id = $TIMELINE_CONTROLLER_LAYER_SCALE_ID;
        document.body.appendChild(select);

        const option1 = document.createElement("option");
        option1.value = "0.5";
        select.appendChild(option1);

        const option2 = document.createElement("option");
        option2.value = "1.0";
        select.appendChild(option2);

        const option3 = document.createElement("option");
        option3.value = "1.5";
        select.appendChild(option3);

        expect(workSpace.timelineAreaState.frameHeight).toBe($TIMELINE_DEFAULT_FRAME_HEIGHT_SIZE);
        expect(option1.selected).toBe(true);
        expect(option2.selected).toBe(false);
        expect(option3.selected).toBe(false);

        execute();

        expect(option1.selected).toBe(false);
        expect(option2.selected).toBe(true);
        expect(option3.selected).toBe(false);

        workSpace.timelineAreaState.frameHeight = $TIMELINE_DEFAULT_FRAME_HEIGHT_SIZE * 1.5;
        execute();

        expect(option1.selected).toBe(false);
        expect(option2.selected).toBe(false);
        expect(option3.selected).toBe(true);

        workSpace.timelineAreaState.frameHeight = $TIMELINE_DEFAULT_FRAME_HEIGHT_SIZE * 0.5;
        execute();

        expect(option1.selected).toBe(true);
        expect(option2.selected).toBe(false);
        expect(option3.selected).toBe(false);

        workSpace.timelineAreaState.frameHeight = $TIMELINE_DEFAULT_FRAME_HEIGHT_SIZE;
        execute();

        expect(option1.selected).toBe(false);
        expect(option2.selected).toBe(true);
        expect(option3.selected).toBe(false);

        select.remove();
    });
});