import { stageSetting } from "@/controller/domain/model/StageSetting";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalStage } from "@/external/core/domain/model/ExternalStage";
import { $updateKeyLock } from "@/shortcut/ShortcutUtil";

/**
 * @description ステージエリアの高さを更新
 *              Update the height of the stage area
 *
 * @param  {FocusEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: FocusEvent): Promise<void> =>
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

    const afterHeight = Math.max(1, Math.min(height, Number.MAX_VALUE));

    // 外部APIを起動
    const externalStage = new ExternalStage(workSpace);

    // ロック設定がされている場合は高さも更新
    if (stageSetting.lock) {
        const diff = afterHeight - externalStage.getHeight();
        await externalStage.setWidth(externalStage.getWidth() + diff);
    }

    // 幅を更新
    await externalStage.setHeight(afterHeight);
};