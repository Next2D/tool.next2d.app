import { $CONTROLLER_AREA_PROPERTY_ID } from "@/config/PropertyConfig";

/**
 * @description プロパティエリアの移動処理
 *              Movement process for property area
 *
 * @params {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 親のイベントを中止する
    event.stopPropagation();
    event.preventDefault();

    // 遅延実行
    requestAnimationFrame((): void =>
    {
        const element: HTMLElement | null = document
            .getElementById($CONTROLLER_AREA_PROPERTY_ID);

        if (!element) {
            return ;
        }

        // ツールエリアを移動
        element.style.left = `${element.offsetLeft + event.movementX}px`;
        element.style.top  = `${element.offsetTop  + event.movementY}px`;
    });
};