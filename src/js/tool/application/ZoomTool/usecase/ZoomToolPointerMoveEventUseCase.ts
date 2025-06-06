import { execute as zoomToolPointerMoveEventUseCase } from "./ZoomToolPointerPromiseMoveEventUseCase";

/**
 * @type {Promise}
 * @private
 */
let $pointerDownQueue: Promise<void> = Promise.resolve();

/**
 * @description ズームポインターモーブイベントを実行
 *              Execute zoom pointer move event
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    $pointerDownQueue = $pointerDownQueue
        .then(() => zoomToolPointerMoveEventUseCase(event));
};