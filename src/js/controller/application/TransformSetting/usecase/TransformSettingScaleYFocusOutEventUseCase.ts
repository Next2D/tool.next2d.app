import { $updateKeyLock } from "@/shortcut/ShortcutUtil";
import { $clamp } from "@/global/GlobalUtil";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { execute as transformSettingUpdateScaleXToElementValuesUseCase } from "./TransformSettingUpdateScaleXToElementValuesUseCase";
import { execute as transformSettingUpdateScaleYToElementValuesUseCase } from "./TransformSettingUpdateScaleYToElementValuesUseCase";
import { execute as transformSettingUpdateScaleToRedrawCanvasUseCase } from "./TransformSettingUpdateScaleToRedrawCanvasUseCase";
import { $TRANSFORM_OBJECT_SCALE_X_ID } from "@/config/TransformSettingConfig";

/**
 * @description yスケールの入力完了処理
 *              Y scale input completion processing
 *
 * @param  {FocusEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: FocusEvent): Promise<void> =>
{
    // 数値が0では割れないので、スキップ
    if (!transformSetting.beforeScaleY) {
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

    let scaleY = $clamp(
        Math.round(parseFloat(element.value) * 100) / 100,
        Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER
    );
    if (!scaleY) {
        scaleY = 0.01;
    }

    element.value = `${scaleY}`;

    // 変形に合わせて表示を更新
    const scale = scaleY / transformSetting.beforeScaleY;
    transformSettingUpdateScaleYToElementValuesUseCase(scale);

    if (transformSetting.scaleLocked
        && transformSetting.beforeScaleX
    ) {

        const scaleXElement = document
            .getElementById($TRANSFORM_OBJECT_SCALE_X_ID) as HTMLInputElement;
        if (!scaleXElement) {
            return ;
        }

        let scaleX = $clamp(
            Math.round(parseFloat(scaleXElement.value) * scale * 100) / 100,
            Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER
        );
        if (!scaleX) {
            scaleX = 0.01;
        }

        scaleXElement.value = `${scaleX}`;

        // 変形に合わせて表示を更新
        transformSettingUpdateScaleXToElementValuesUseCase(scale);
    }

    // 変更後のmatrixで表示を更新
    await transformSettingUpdateScaleToRedrawCanvasUseCase();
};