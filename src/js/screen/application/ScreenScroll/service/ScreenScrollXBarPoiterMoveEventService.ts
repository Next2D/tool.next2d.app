import { $SCREEN_ID } from "@/config/ScreenConfig";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { screenArea } from "@/screen/domain/model/ScreenArea";
import { $setEditingElement } from "@/global/GlobalUtil";

/**
 * @description スクリーンエリアのxスクロールバーのマウス移動イベント
 *              Mouse move event of x scroll bar in screen area
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // メニューを非表示
    $allHideMenu();

    // 編集中のElementを初期化
    $setEditingElement(null);

    // 親のイベントをキャンセル
    event.stopPropagation();
    event.preventDefault();

    requestAnimationFrame((): void =>
    {
        const screenElement = document.getElementById($SCREEN_ID);
        if (!screenElement) {
            return ;
        }

        const element = event.target as HTMLElement;
        if (!element) {
            return ;
        }

        screenElement.scrollLeft += event.movementX / screenArea.xScale;
        element.style.left = `${Math.floor(screenElement.scrollLeft * screenArea.xScale)}px`;
    });
};