import {
    $setDestIconFrame,
    $setHitElement
} from "../../TimelineUtil";

/**
 * @description マウスアウトイベントを実行する
 *              Execute the mouse out event
 *
 * @param  {HTMLElement} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    // 移動先を初期化
    $setDestIconFrame(0);

    // styleを初期化
    element.style.backgroundColor = "";

    // ヒットした要素を初期化
    $setHitElement(null);
};