import { stageSetting } from "@/controller/domain/model/StageSetting";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalStage } from "@/external/core/domain/model/ExternalStage";
import { $updateKeyLock } from "@/shortcut/ShortcutUtil";

/**
 * @description ステージエリアの幅を更新
 *              Update the width of the stage area
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

    // イベントの伝播を止める
    // fixed logic
    event.stopPropagation();

    const workSpace = $getCurrentWorkSpace();
    const width = parseInt(element.value);
    if (isNaN(width) || 0 >= width) {
        element.value = `${workSpace.stage.width}`;
        return ;
    }

    const afterWidth = Math.max(1, Math.min(width, Number.MAX_VALUE));

    // 外部APIを起動
    const externalStage = new ExternalStage(workSpace);

    // ロック設定がされている場合は高さも更新
    if (stageSetting.lock) {
        const diff = afterWidth - externalStage.getWidth();
        await externalStage.setHeight(externalStage.getHeight() + diff);
    }

    // 幅を更新
    await externalStage.setWidth(afterWidth);
};