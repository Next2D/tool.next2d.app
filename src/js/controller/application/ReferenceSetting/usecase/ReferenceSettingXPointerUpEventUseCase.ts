import { EventType } from "@/tool/domain/event/EventType";
import { execute as referenceSettingXPointerMoveEventUseCase } from "./ReferenceSettingXPointerMoveEventUseCase";
// import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
// import { ExternalReference } from "@/external/controller/domain/model/ExternalReference";
import {
    $clamp,
    $setCursor
} from "@/global/GlobalUtil";

/**
 * @description 中心点エリアのx座標の値操作のポインタアップイベント
 *              Pointer up event for value operation of x-coordinate of center point area
 *
 * @param  {PointerEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    // カーソルを変更
    $setCursor("auto");

    const element = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();

    // イベントを削除
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener(EventType.POINTER_MOVE,
        referenceSettingXPointerMoveEventUseCase
    );
    element.removeEventListener(EventType.POINTER_UP, execute);
    element.removeEventListener(EventType.POINTER_LEAVE, execute);
    element.removeEventListener(EventType.POINTER_CANCEL, execute);

    const value = parseFloat(element.value);
    const x = $clamp(Math.ceil(value),
        -Number.MAX_VALUE, Number.MAX_VALUE
    );

    element.value = `${x}`;

    // x座標を更新
    // const workSpace = $getCurrentWorkSpace();
    // const externalReference = new ExternalReference(workSpace, workSpace.scene);
    // await externalReference.setX(x);

    // input要素のフォーカス
    element.focus();
};