import { $updateKeyLock } from "@/shortcut/ShortcutUtil";
import { $clamp } from "@/global/GlobalUtil";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { execute as transformSettingUpdateScaleXToElementValuesUseCase } from "./TransformSettingUpdateScaleXToElementValuesUseCase";
import { execute as transformSettingUpdateScaleXToRedrawCanvasService } from "../service/TransformSettingUpdateScaleXToRedrawCanvasService";

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

    const width = $clamp(parseFloat(parseFloat(element.value).toFixed(2)), 0, Number.MAX_VALUE);
    element.value = `${width}`;

    // 変形に合わせて表示を更新
    transformSettingUpdateScaleXToElementValuesUseCase(width / transformSetting.w);

    // 変更後のmatrixで表示を更新
    await transformSettingUpdateScaleXToRedrawCanvasService();

    // TODO 親のMovieClipのキャッシュを削除

    // 変更前のmatrixを削除
    transformSetting.matrixs.length = 0;
};