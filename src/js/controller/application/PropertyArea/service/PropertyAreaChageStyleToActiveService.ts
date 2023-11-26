import { $CONTROLLER_DEFAULT_WIDTH_SIZE } from "@/config/ControllerConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";

/**
 * @description タイムラインエリアを移動可能な状態にする
 *              Make the timeline area movable
 *
 * @param  {HTMLElement} element
 * @return {void}
 * @method
 * @public
 */
export const execute = (element: HTMLElement): void =>
{
    const workSpace = $getCurrentWorkSpace();
    const propertyAreaState = workSpace.propertyAreaState;

    // タイムラインエリアのstyleを変更
    element.style.display         = "";
    element.style.width           = `${$CONTROLLER_DEFAULT_WIDTH_SIZE}px`;
    element.style.height          = "96vh";
    element.style.left            = `${propertyAreaState.offsetLeft}px`;
    element.style.top             = `${propertyAreaState.offsetTop}px`;
    element.style.zIndex          = `${0xffffff}`;
    element.style.backgroundColor = "#2c2c2c";
    element.style.boxShadow       = "0 0 5px rgba(245, 245, 245, 0.25)";
    element.style.position        = "fixed"; // fixed logic
};