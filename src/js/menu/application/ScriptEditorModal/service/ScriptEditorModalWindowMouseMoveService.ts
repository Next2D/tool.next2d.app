import { $SCRIPT_EDITOR_MODAL_ID } from "@/config/ScriptEditorModalConfig";

/**
 * @type {HTMLElement}
 * @private
 */
const $element: HTMLElement = document.getElementById($SCRIPT_EDITOR_MODAL_ID) as NonNullable<HTMLElement>;

/**
 * @description スクリプトエディタの移動処理関数
 *              Script Editor Move Processing Functions
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 他のイベントを中止
    event.stopPropagation();
    event.preventDefault();

    requestAnimationFrame((): void =>
    {
        $element.style.left = `${$element.offsetLeft + event.movementX}px`;
        $element.style.top  = `${$element.offsetTop  + event.movementY}px`;
    });
};