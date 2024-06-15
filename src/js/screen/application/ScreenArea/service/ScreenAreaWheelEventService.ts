import { $SCREEN_ID } from "@/config/ScreenConfig";

/**
 * @description タイマーID
 *              Timer ID
 *
 * @type {NodeJS.Timeout}
 * @private
 */
let timerId: NodeJS.Timeout;

/**
 * @description 移動モード、x: 横方向、y: 縦方向
 *              Move mode, x: horizontal, y: vertical
 *
 * @type {string}
 * @private
 */
let mode: string = "";

/**
 * @description スクリーンエリアのホイールイベント
 *              Screen area wheel event
 *
 * @param  {WheelEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: WheelEvent): void =>
{
    // 他のイベントを中止
    event.stopPropagation();
    event.preventDefault();

    requestAnimationFrame((): void =>
    {
        const element: HTMLElement | null = document
            .getElementById($SCREEN_ID);

        if (!element) {
            return ;
        }

        // タイマーをクリア
        clearTimeout(timerId);

        // 移動モードを設定
        if (!mode) {
            mode = event.deltaX ? "x" : "y";
        }

        // 移動モードに合わせて移動
        switch (mode) {

            case "x":
                element.scrollLeft += event.deltaX;
                break;

            case "y":
                element.scrollTop += event.deltaY;
                break;

            default:
                break;

        }

        timerId = setTimeout((): void =>
        {
            mode = "";
        }, 60);
    });
};