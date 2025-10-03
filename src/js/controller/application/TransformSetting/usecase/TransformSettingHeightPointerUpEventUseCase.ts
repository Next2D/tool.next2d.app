import { $clamp, $setCursor } from "@/global/GlobalUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { execute as transformSettingHeightPointerMoveEventUseCase } from "./TransformSettingHeightPointerMoveEventUseCase";
import { execute as transformSettingUpdateHeightToElementValuesUseCase } from "./TransformSettingUpdateHeightToElementValuesUseCase";
import { execute as transformSettingUpdateWidthToElementValuesUseCase } from "./TransformSettingUpdateWidthToElementValuesUseCase";
import { execute as transformSettingUpdateSizeToRedrawCanvasUseCase } from "./TransformSettingUpdateSizeToRedrawCanvasUseCase";
import { $setTransformSettingState } from "../TransformSettingUtil";

/**
 * @description 変形エリアの幅の値操作のマウスアップイベント
 *              Mouse up event for value operation of width of deformation area
 *
 * @param  {PointerEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    // 変形の状態を変更
    $setTransformSettingState("up");

    // カーソルを変更
    $setCursor("auto");

    const element = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();

    // windowのイベントを削除
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.POINTER_MOVE,
        transformSettingHeightPointerMoveEventUseCase
    );
    element.removeEventListener(EventType.POINTER_UP, execute);
    element.removeEventListener(EventType.POINTER_CANCEL, execute);
    element.removeEventListener(EventType.POINTER_LEAVE, execute);

    // 変形に合わせて表示を更新
    const height = $clamp(
        Math.round(parseFloat(element.value) * 100) / 100,
        1, Number.MAX_VALUE
    );

    const scale = height / transformSetting.h;
    await transformSettingUpdateHeightToElementValuesUseCase(scale);

    if (transformSetting.sizeLocked) {
        await transformSettingUpdateWidthToElementValuesUseCase(scale);
    }

    // 変更後のmatrixで表示を更新
    await transformSettingUpdateSizeToRedrawCanvasUseCase();

    // input要素のフォーカス
    element.focus();
};