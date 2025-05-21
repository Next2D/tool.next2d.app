import { $updateKeyLock } from "@/shortcut/ShortcutUtil";
import { $clamp, $setEditingElement } from "@/global/GlobalUtil";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { execute as transformSettingUpdateScaleYToElementValuesUseCase } from "./TransformSettingUpdateScaleYToElementValuesUseCase";
import { execute as transformSettingUpdateScaleYToRedrawCanvasService } from "../service/TransformSettingUpdateScaleYToRedrawCanvasService";
import { execute as timelineSceneListCacheRemoveService } from "@/timeline/application/TimelineSceneList/service/TimelineSceneListCacheRemoveService";

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

    // 編集中の要素を解除
    $setEditingElement(null);

    const height = $clamp(parseFloat(parseFloat(element.value).toFixed(2)), 0, Number.MAX_VALUE);
    element.value = `${height}`;

    // 変形に合わせて表示を更新
    transformSettingUpdateScaleYToElementValuesUseCase(height / transformSetting.beforeValue);

    // 変更後のmatrixで表示を更新
    await transformSettingUpdateScaleYToRedrawCanvasService();

    // 親のMovieClipのキャッシュを削除
    timelineSceneListCacheRemoveService();

    // 変更前のmatrixを削除
    transformSetting.matrixs.length = 0;
};