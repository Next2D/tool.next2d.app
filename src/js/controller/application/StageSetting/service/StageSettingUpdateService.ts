import { Stage } from "@/core/domain/model/Stage";
import {
    $STAGE_BG_COLOR_ID,
    $STAGE_FPS_ID,
    $STAGE_HEIGHT_ID,
    $STAGE_LOCK_ID,
    $STAGE_WIDTH_ID
} from "@/config/StageSettingConfig";

/**
 * @description ステージ設定の各値を更新
 *              Update each value of stage setting
 *
 * @param  {Stage} stage
 * @return {void}
 * @method
 * @public
 */
export const execute = (stage: Stage): void =>
{
    const stageWidth: HTMLInputElement | null = document
        .getElementById($STAGE_WIDTH_ID) as HTMLInputElement;

    if (stageWidth) {
        stageWidth.value = `${stage.width}`;
    }

    const stageHeight: HTMLInputElement | null = document
        .getElementById($STAGE_HEIGHT_ID) as HTMLInputElement;

    if (stageHeight) {
        stageHeight.value = `${stage.height}`;
    }

    const stageFps: HTMLInputElement | null = document
        .getElementById($STAGE_FPS_ID) as HTMLInputElement;

    if (stageFps) {
        stageFps.value = `${stage.fps}`;
    }

    const stageBgColor: HTMLInputElement | null = document
        .getElementById($STAGE_BG_COLOR_ID) as HTMLInputElement;

    if (stageBgColor) {
        stageBgColor.value = stage.bgColor;
    }

    const stageLock: HTMLElement | null = document
        .getElementById($STAGE_LOCK_ID);

    if (stageLock && stageLock.children.length) {
        stageLock
            .children[0]
            .setAttribute("class", stage.lock
                ? "active"
                : "disable"
            );
    }
};