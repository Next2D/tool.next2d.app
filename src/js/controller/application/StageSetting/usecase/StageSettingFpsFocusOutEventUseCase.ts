import { $STAGE_DEFAULT_FPS } from "@/config/StageSettingConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalStage } from "@/external/core/domain/model/ExternalStage";
import { $updateKeyLock } from "@/shortcut/ShortcutUtil";

/**
 * @description ステージエリアのフレームレートを更新
 *              Update the frame rate of the stage area
 *
 * @param  {FocusEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: FocusEvent): void =>
{
    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // 入力モードを終了する
    $updateKeyLock(false);

    const element = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    const fps = parseInt(element.value);
    if (isNaN(fps) || 0 >= fps) {
        element.value = `${workSpace.stage.fps}`;
        return ;
    }

    const externalStage = new ExternalStage(workSpace);
    externalStage.fps   = Math.max(1, Math.min(fps, $STAGE_DEFAULT_FPS));

    // 表示を更新
    element.value = `${externalStage.fps}`;
};