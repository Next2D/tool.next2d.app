import { $updateKeyLock } from "@/shortcut/ShortcutUtil";
import { $clamp } from "@/global/GlobalUtil";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { execute as transformSettingUpdateScaleXToElementValuesUseCase } from "./TransformSettingUpdateScaleXToElementValuesUseCase";
import { execute as transformSettingUpdateScaleYToElementValuesUseCase } from "./TransformSettingUpdateScaleYToElementValuesUseCase";
import { execute as transformSettingUpdateScaleToRedrawCanvasUseCase } from "./TransformSettingUpdateScaleToRedrawCanvasUseCase";

/**
 * @description xスケールの入力完了処理
 *              X scale input completion processing
 *
 * @param  {FocusEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: FocusEvent): Promise<void> =>
{
    // 数値が0では割れないので、スキップ
    if (!transformSetting.beforeScaleX) {
        return ;
    }

    const element = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    // 入力モードを終了する
    $updateKeyLock(false);

    // イベントの伝播を止める
    event.stopPropagation();

    let scaleX = $clamp(
        Math.round(parseFloat(element.value) * 100) / 100,
        Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER
    );
    if (!scaleX) {
        scaleX = 0.01;
    }

    // 変形に合わせて表示を更新
    const scale = scaleX / transformSetting.beforeScaleX;
    await transformSettingUpdateScaleXToElementValuesUseCase(scale);

    if (transformSetting.scaleLocked
        && transformSetting.beforeScaleY
    ) {
        // 変形に合わせて表示を更新
        await transformSettingUpdateScaleYToElementValuesUseCase(scale);
    }

    // 変更後のmatrixで表示を更新
    await transformSettingUpdateScaleToRedrawCanvasUseCase();
};