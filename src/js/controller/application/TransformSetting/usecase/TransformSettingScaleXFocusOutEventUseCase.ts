import { $updateKeyLock } from "@/shortcut/ShortcutUtil";
import { $clamp } from "@/global/GlobalUtil";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { execute as transformSettingUpdateScaleXToElementValuesUseCase } from "./TransformSettingUpdateScaleXToElementValuesUseCase";
import { execute as transformSettingUpdateScaleYToElementValuesUseCase } from "./TransformSettingUpdateScaleYToElementValuesUseCase";
import { execute as transformSettingUpdateScaleToRedrawCanvasUseCase } from "./TransformSettingUpdateScaleToRedrawCanvasUseCase";
import { $TRANSFORM_OBJECT_SCALE_Y_ID } from "@/config/TransformSettingConfig";

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
    const element = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();

    // 入力モードを終了する
    $updateKeyLock(false);

    let scaleX = $clamp(parseFloat(parseFloat(element.value).toFixed(2)), -Number.MAX_VALUE, Number.MAX_VALUE);
    if (!scaleX) {
        scaleX = 0.01;
    }

    element.value = `${scaleX}`;

    // 変形に合わせて表示を更新
    const scale = scaleX / transformSetting.beforeScaleX;
    transformSettingUpdateScaleXToElementValuesUseCase(scale);

    if (transformSetting.scaleLocked) {

        const scaleYElement = document
            .getElementById($TRANSFORM_OBJECT_SCALE_Y_ID) as HTMLInputElement;
        if (!scaleYElement) {
            return ;
        }

        const value  = parseFloat(scaleYElement.value);
        let scaleY = $clamp(parseFloat((value * scale).toFixed(2)), -Number.MAX_VALUE, Number.MAX_VALUE);
        if (!scaleY) {
            scaleY = 0.01;
        }

        scaleYElement.value = `${scaleY}`;

        // 変形に合わせて表示を更新
        transformSettingUpdateScaleYToElementValuesUseCase(scaleY / transformSetting.beforeScaleY);
    }

    // 変更後のmatrixで表示を更新
    await transformSettingUpdateScaleToRedrawCanvasUseCase();

    // 変更前のmatrixを削除
    transformSetting.clear();
};