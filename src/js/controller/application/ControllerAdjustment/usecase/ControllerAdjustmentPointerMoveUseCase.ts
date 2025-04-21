import { $CONTROLLER_DEFAULT_WIDTH_SIZE } from "@/config/ControllerConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { execute as screenScrollResizeService } from "@/screen/application/ScreenScroll/service/ScreenScrollResizeService";

/**
 * @member {number}
 * @private
 */
let $timerId: number = 0;

/**
 * @description タイムラインの幅を調整
 *              Adjust the width of the timeline
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (!event.movementX) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    cancelAnimationFrame($timerId);
    $timerId = requestAnimationFrame((): void =>
    {
        const style: CSSStyleDeclaration = document
            .documentElement
            .style;

        let width: number = parseFloat(style.getPropertyValue("--controller-width"));
        width -= event.movementX;
        width = Math.max($CONTROLLER_DEFAULT_WIDTH_SIZE, width);
        style.setProperty("--controller-width", `${width}px`);

        const workSpace = $getCurrentWorkSpace();
        workSpace.controllerAreaState.width = width;

        // スクリーンのスクロールサイズを再計算
        screenScrollResizeService();
    });
};