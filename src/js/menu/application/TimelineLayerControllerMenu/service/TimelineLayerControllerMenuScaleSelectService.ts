import { $TIMELINE_DEFAULT_FRAME_HEIGHT_SIZE } from "@/config/TimelineConfig";
import { $TIMELINE_CONTROLLER_LAYER_SCALE_ID } from "@/config/TimelineLayerControllerMenuConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description 現在のプロジェクトのレイヤーの高さの値に合わせて、select elementの値をセット
 *              Set the value of select element to match the height value of the layer in the current project
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const element: HTMLSelectElement | null = document
        .getElementById($TIMELINE_CONTROLLER_LAYER_SCALE_ID) as HTMLSelectElement;

    if (!element) {
        return ;
    }

    const value = `${$getCurrentWorkSpace().timelineAreaState.frameHeight / $TIMELINE_DEFAULT_FRAME_HEIGHT_SIZE}`;

    const options = element.options;
    const length = options.length;
    for (let idx = 0; length > idx; ++idx) {
        const option = options[idx];

        if (option.value !== value) {
            continue;
        }

        option.selected = true;
        break;
    }
};