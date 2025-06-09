import { $updateKeyLock } from "@/shortcut/ShortcutUtil";
import { $clamp } from "@/global/GlobalUtil";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { execute as transformSettingUpdateScaleXToElementValuesUseCase } from "./TransformSettingUpdateScaleXToElementValuesUseCase";
import { execute as transformSettingUpdateScaleYToElementValuesUseCase } from "./TransformSettingUpdateScaleYToElementValuesUseCase";
import { execute as timelineSceneListCacheRemoveService } from "@/timeline/application/TimelineSceneList/service/TimelineSceneListCacheRemoveService";
import { execute as transformSettingUpdateScaleToRedrawCanvasUseCase } from "./TransformSettingUpdateScaleToRedrawCanvasUseCase";
import { $TRANSFORM_OBJECT_WIDTH_ID } from "@/config/TransformSettingConfig";

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
    const element = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();

    // 入力モードを終了する
    $updateKeyLock(false);

    const height = $clamp(parseFloat(parseFloat(element.value).toFixed(2)), 1, Number.MAX_VALUE);
    element.value = `${height}`;

    // 変形に合わせて表示を更新
    transformSettingUpdateScaleYToElementValuesUseCase(height / transformSetting.beforeValue);

    if (transformSetting.sizeLocked) {
        const widthElement = document
            .getElementById($TRANSFORM_OBJECT_WIDTH_ID) as HTMLInputElement;
        if (!widthElement) {
            return ;
        }

        const value = parseFloat(parseFloat(widthElement.value).toFixed(2)) + (height - transformSetting.beforeValue);
        const width = $clamp(value, 1, Number.MAX_VALUE);
        widthElement.value = `${width}`;

        // 変形に合わせて表示を更新
        transformSettingUpdateScaleXToElementValuesUseCase(width / transformSetting.lockValue);
    }

    // 変更後のmatrixで表示を更新
    await transformSettingUpdateScaleToRedrawCanvasUseCase();

    // 親のMovieClipのキャッシュを削除
    timelineSceneListCacheRemoveService();

    // 変更前のmatrixを削除
    transformSetting.matrixs.length = 0;
};