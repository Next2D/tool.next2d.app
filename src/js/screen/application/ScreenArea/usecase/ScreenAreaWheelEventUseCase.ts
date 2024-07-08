import { $SCREEN_ID, $SCREEN_SCROLL_BAR_X_ID, $SCREEN_SCROLL_BAR_Y_ID } from "@/config/ScreenConfig";
import { $SCREEN_SCALE_ID } from "@/config/ToolConfig";
import { $ZOOM_MAX_VALUE, $ZOOM_MIN_VALUE } from "@/config/ZoomConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $clamp } from "@/global/GlobalUtil";
import { screenArea } from "@/screen/domain/model/ScreenArea";
import { execute as zoomToolRealodWorkSpaceUseCase } from "@/tool/application/ZoomTool/usecase/ZoomToolRealodWorkSpaceUseCase";

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

    requestAnimationFrame(async (): Promise<void> =>
    {
        const element: HTMLElement | null = document
            .getElementById($SCREEN_ID);

        if (!element) {
            return ;
        }

        // タイマーをクリア
        clearTimeout(timerId);

        if (event.ctrlKey && !event.metaKey // windows
            || !event.ctrlKey && event.metaKey // mac
        ) {
            if (!event.deltaY) {
                return ;
            }

            const element = document
                .getElementById($SCREEN_SCALE_ID) as HTMLInputElement;

            if (!element) {
                return ;
            }

            const scale = $clamp(parseFloat(element.value) - Math.ceil(event.deltaY), $ZOOM_MIN_VALUE, $ZOOM_MAX_VALUE);
            element.value = `${scale}`;

            const workSpace = $getCurrentWorkSpace();
            if (workSpace.scale === scale) {
                return ;
            }

            await zoomToolRealodWorkSpaceUseCase(scale / 100);

            return ;
        }

        // 移動モードを設定
        if (!mode) {
            mode = event.deltaX ? "x" : "y";
        }

        // 移動モードに合わせて移動
        switch (mode) {

            case "x":
                {
                    element.scrollLeft += event.deltaX;
                    const xElement = document.getElementById($SCREEN_SCROLL_BAR_X_ID);
                    if (xElement) {
                        xElement.style.left = `${Math.floor(element.scrollLeft * screenArea.xScale)}px`;
                    }
                }
                break;

            case "y":
                {
                    element.scrollTop += event.deltaY;
                    const yElement = document.getElementById($SCREEN_SCROLL_BAR_Y_ID);
                    if (yElement) {
                        yElement.style.top = `${Math.floor(element.scrollTop * screenArea.yScale)}px`;
                    }
                }
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