import {
    $getMoveIconFrame,
    $setDestIconFrame,
    $setHitElement
} from "../../TimelineUtil";

/**
 * @description マウスオーバーイベントを実行する
 *              Execute mouse over event
 *
 * @param  {HTMLElement} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    // 移動先のフレームをセット
    let frameData: string | undefined = element.dataset.frame;
    if (!frameData) {
        const parentElement = element.parentElement as HTMLElement;
        if (parentElement) {
            frameData = parentElement.dataset.frame;
        }

        if (!frameData) {
            return ;
        }
    }

    const frame = parseInt(frameData);
    $setDestIconFrame(frame);

    // ヒットした要素の背景色を変更
    if ($getMoveIconFrame() !== frame) {

        // styleを変更
        element.style.backgroundColor = "#3692f0";

        // ヒットした要素をセット
        $setHitElement(element);
    }
};