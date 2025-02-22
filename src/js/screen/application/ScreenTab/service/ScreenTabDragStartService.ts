import { $allHideMenu } from "@/menu/application/MenuUtil";
import { $setDragElement } from "@/screen/application/ScreenUtil";
import { $setEditingElement } from "@/global/GlobalUtil";

/**
 * @description dragstartのイベント処理関数
 *              Event processing function of dragstart
 *
 * @param  {DragEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: DragEvent): void =>
{
    // 全てのメニューを非表示にする
    $allHideMenu();

    // 編集中のElementを初期化
    $setEditingElement(null);

    // 移動するElementを一時保存
    $setDragElement(event.target as HTMLElement);
};