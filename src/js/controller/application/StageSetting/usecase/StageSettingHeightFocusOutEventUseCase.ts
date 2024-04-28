import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalStage } from "@/external/core/domain/model/ExternalStage";
import { $updateKeyLock } from "@/shortcut/ShortcutUtil";

/**
 * @description ステージエリアの高さを更新
 *              Update the height of the stage area
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
    const height = parseInt(element.value);
    if (isNaN(height) || 0 >= height) {
        element.value = `${workSpace.stage.height}`;
        return ;
    }

    const externalStage  = new ExternalStage(workSpace);
    externalStage.height = Math.max(1, Math.min(
        height,
        Number.MAX_VALUE
    ));

    // 表示を更新
    element.value = `${externalStage.height}`;
};