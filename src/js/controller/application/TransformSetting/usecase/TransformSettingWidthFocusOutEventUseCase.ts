import { $updateKeyLock } from "@/shortcut/ShortcutUtil";
import { $clamp, $setEditingElement } from "@/global/GlobalUtil";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { execute as transformSettingUpdateScaleXToElementValuesUseCase } from "./TransformSettingUpdateScaleXToElementValuesUseCase";
import { execute as transformSettingUpdateScaleXToRedrawCanvasService } from "../service/TransformSettingUpdateScaleXToRedrawCanvasService";
import { execute as timelineSceneListCacheRemoveService } from "@/timeline/application/TimelineSceneList/service/TimelineSceneListCacheRemoveService";

/**
 * @description 幅の入力完了処理
 *              Width input completion processing
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

    const width = $clamp(parseFloat(parseFloat(element.value).toFixed(2)), 1, Number.MAX_VALUE);
    element.value = `${width}`;

    // 変形に合わせて表示を更新
    transformSettingUpdateScaleXToElementValuesUseCase(width / transformSetting.beforeValue);

    // 変更後のmatrixで表示を更新
    await transformSettingUpdateScaleXToRedrawCanvasService();

    // 親のMovieClipのキャッシュを削除
    timelineSceneListCacheRemoveService();

    // 変更前のmatrixを削除
    transformSetting.matrixs.length = 0;
};