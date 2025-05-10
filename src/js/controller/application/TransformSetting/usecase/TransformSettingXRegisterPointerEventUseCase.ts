import { EventType } from "@/tool/domain/event/EventType";
import { execute as transformSettingXPointerMoveEventUseCase } from "./TransformSettingXPointerMoveEventUseCase";
import { execute as transformSettingXPointerUpEventUseCase } from "./TransformSettingXPointerUpEventUseCase";

/**
 * @type {Promise}
 * @private
 */
let $queue: Promise<void> = Promise.resolve();

/**
 * @description 変形エリアのx座標の数値変更のマウス操作イベントをwindowに登録
 *              Register mouse operation events for numerical changes in x-coordinate of deformation area in window
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    const element = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    // 移動のイベントを登録
    element.setPointerCapture(event.pointerId);
    element.addEventListener(
        EventType.POINTER_MOVE,
        transformSettingXPointerMoveEventUseCase,
        { "passive": false }
    );

    element.addEventListener(
        EventType.POINTER_UP,
        transformSettingXPointerUpEventUseCase
    );
    element.addEventListener(
        EventType.POINTER_LEAVE,
        transformSettingXPointerUpEventUseCase
    );
    element.addEventListener(
        EventType.POINTER_CANCEL,
        transformSettingXPointerUpEventUseCase
    );
};