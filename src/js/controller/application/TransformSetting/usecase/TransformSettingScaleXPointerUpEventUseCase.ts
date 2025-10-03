import { $clamp, $setCursor } from "@/global/GlobalUtil";
import { EventType } from "@/tool/domain/event/EventType";
import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { execute as transformSettingScaleXPointerMoveEventUseCase } from "./TransformSettingScaleXPointerMoveEventUseCase";
import { execute as transformSettingUpdateScaleToRedrawCanvasUseCase } from "./TransformSettingUpdateScaleToRedrawCanvasUseCase";
import { execute as transformSettingUpdateScaleXToElementValuesUseCase } from "./TransformSettingUpdateScaleXToElementValuesUseCase";
import { execute as transformSettingUpdateScaleYToElementValuesUseCase } from "./TransformSettingUpdateScaleYToElementValuesUseCase";
import { $setTransformSettingState } from "../TransformSettingUtil";

/**
 * @description 変形エリアのxスケールの値操作のマウスアップイベント
 *              Mouse up event for value operation of x scale of deformation area
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
        transformSettingScaleXPointerMoveEventUseCase
    );
    element.removeEventListener(EventType.POINTER_UP, execute);
    element.removeEventListener(EventType.POINTER_CANCEL, execute);
    element.removeEventListener(EventType.POINTER_LEAVE, execute);

    // 変形に合わせて表示を更新
    const scaleX = $clamp(
        Math.round(parseFloat(element.value) * 100) / 100,
        Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER
    );

    const scale = scaleX / 100 / transformSetting.scaleX;
    await transformSettingUpdateScaleXToElementValuesUseCase(scale);

    if (transformSetting.scaleLocked
        && transformSetting.scaleY
    ) {
        await transformSettingUpdateScaleYToElementValuesUseCase(scale);
    }

    // 変更後のmatrixで表示を更新
    await transformSettingUpdateScaleToRedrawCanvasUseCase();

    // input要素のフォーカス
    element.focus();
};