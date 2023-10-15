import { Stage } from "../../../core/model/Stage";

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
        .getElementById("stage-width") as HTMLInputElement;

    if (stageWidth) {
        stageWidth.value = `${stage.width}`;
    }

    const stageHeight: HTMLInputElement | null = document
        .getElementById("stage-height") as HTMLInputElement;

    if (stageHeight) {
        stageHeight.value = `${stage.height}`;
    }

    const stageFps: HTMLInputElement | null = document
        .getElementById("stage-fps") as HTMLInputElement;

    if (stageFps) {
        stageFps.value = `${stage.fps}`;
    }

    const stageBgColor: HTMLInputElement | null = document
        .getElementById("stage-bgColor") as HTMLInputElement;

    if (stageBgColor) {
        stageBgColor.value = stage.bgColor;
    }

    const stageLock: HTMLElement | null = document
        .getElementById("stage-lock");

    if (stageLock && stageLock.children.length) {
        stageLock
            .children[0]
            .setAttribute("class", stage.lock
                ? "active"
                : "disable"
            );
    }
};