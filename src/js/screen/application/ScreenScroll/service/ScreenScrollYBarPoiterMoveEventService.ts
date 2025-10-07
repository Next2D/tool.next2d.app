import { $SCREEN_ID } from "@/config/ScreenConfig";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { screenArea } from "@/screen/domain/model/ScreenArea";
import { $setEditingElement } from "@/global/GlobalUtil";

/**
 * @description スクリーンエリアのyスクロールバーのマウス移動イベント
 *              Mouse move event of y scroll bar in screen area
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 親のイベントをキャンセル
    event.stopPropagation();
    event.preventDefault();

    // メニューを非表示
    $allHideMenu();

    // 編集中のElementを初期化
    $setEditingElement(null);

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

        screenElement.scrollTop += event.movementY / screenArea.yScale;
        element.style.top = `${Math.floor(screenElement.scrollTop * screenArea.yScale)}px`;
    });
};