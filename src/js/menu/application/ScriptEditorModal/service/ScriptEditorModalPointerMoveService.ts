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
        const element = event.target as HTMLElement;
        if (!element) {
            return ;
        }

        const parent = element.parentElement as HTMLElement;
        if (!parent) {
            return ;
        }

        parent.style.left = `${parent.offsetLeft + event.movementX}px`;
        parent.style.top  = `${parent.offsetTop  + event.movementY}px`;
    });
};