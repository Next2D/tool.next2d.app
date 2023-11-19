import { $allHideMenu } from "@/menu/application/MenuUtil";
import { $setDragElement } from "@/screen/application/ScreenUtil";

/**
 * @description dragstartのイベント処理関数
 *              Event processing function of dragstart
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: DragEvent): void =>
{
    // 全てのメニューを非表示にする
    $allHideMenu();

    // 移動するElementを一時保存
    $setDragElement(event.target as HTMLElement);
};