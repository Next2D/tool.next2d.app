import { $STAGE_DEFAULT_FPS } from "@/config/StageSettingConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalStage } from "@/external/core/domain/model/ExternalStage";
import { $setEditingElement } from "@/global/GlobalUtil";
import { $updateKeyLock } from "@/shortcut/ShortcutUtil";

/**
 * @description ステージエリアのフレームレートを更新
 *              Update the frame rate of the stage area
 *
 * @param  {FocusEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: FocusEvent): Promise<void> =>
{
    const element = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    // 入力モードを終了する
    $updateKeyLock(false);

    // 入力モードを終了する
    $setEditingElement(null);

    // イベントの伝播を止める
    // fixed logic
    event.stopPropagation();

    const workSpace = $getCurrentWorkSpace();
    const fps = parseInt(element.value);
    if (isNaN(fps) || 0 >= fps) {
        element.value = `${workSpace.stage.fps}`;
        return ;
    }

    // フレームレートを更新
    const externalStage = new ExternalStage(workSpace);
    await externalStage.setFps(Math.max(1, Math.min(fps, $STAGE_DEFAULT_FPS)));

    // 表示を更新
    element.value = `${externalStage.getFps()}`;
};