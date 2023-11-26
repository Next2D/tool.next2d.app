import { $CONTROLLER_DEFAULT_WIDTH_SIZE } from "@/config/ControllerConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

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
    event.stopPropagation();
    event.preventDefault();

    requestAnimationFrame((): void =>
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
    });
};