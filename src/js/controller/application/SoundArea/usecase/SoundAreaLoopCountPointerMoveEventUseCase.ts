import {
    $clamp,
    $setCursor
} from "@/global/GlobalUtil";

/**
 * @description タイマーID
 *              Timer ID
 *
 * @member {number}
 * @default -1
 * @private
 */
let $timerId: number = -1;

/**
 * @description ループ回数操作を開始
 *              Start loop count operation
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

    // カーソルを変更
    $setCursor("ew-resize");

    // マウスの移動量がない場合は処理を終了
    if (!event.movementX) {
        return ;
    }

    cancelAnimationFrame($timerId);
    $timerId = requestAnimationFrame((): void =>
    {
        const element = event.target as HTMLInputElement;
        if (!element) {
            return ;
        }

        // 表示を変更
        element.value = `${$clamp(parseInt(element.value) + event.movementX, 0, 65535)}`;
    });
};