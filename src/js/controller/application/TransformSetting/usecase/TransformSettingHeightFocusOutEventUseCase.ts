import { $updateKeyLock } from "@/shortcut/ShortcutUtil";
import { $clamp } from "@/global/GlobalUtil";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { execute as transformSettingUpdateScaleXToElementValuesUseCase } from "./TransformSettingUpdateScaleXToElementValuesUseCase";
import { execute as transformSettingUpdateHeightToElementValuesUseCase } from "./TransformSettingUpdateHeightToElementValuesUseCase";
import { execute as transformSettingUpdateSizeToRedrawCanvasUseCase } from "./TransformSettingUpdateSizeToRedrawCanvasUseCase";

/**
 * @description 高さの入力完了処理
 *              Height input completion processing
 *
 * @param  {FocusEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: FocusEvent): Promise<void> =>
{
    // 数値が0では割れないので、スキップ
    if (!transformSetting.beforeHeight) {
        return ;
    }

    const element = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();

    // 入力モードを終了する
    $updateKeyLock(false);

    const height = $clamp(
        Math.round(parseFloat(element.value) * 100) / 100,
        1, Number.MAX_VALUE
    );

    // 変形に合わせて表示を更新
    const scale = height / transformSetting.beforeHeight;
    await transformSettingUpdateHeightToElementValuesUseCase(scale);

    if (transformSetting.sizeLocked
        && transformSetting.beforeWidth
    ) {
        // 変形に合わせて表示を更新
        await transformSettingUpdateScaleXToElementValuesUseCase(scale);
    }

    // 変更後のmatrixで表示を更新
    await transformSettingUpdateSizeToRedrawCanvasUseCase();
};