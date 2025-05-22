import { stageSetting } from "@/controller/domain/model/StageSetting";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import {
    $activeTouchPointers,
    $setEditingElement
} from "@/global/GlobalUtil";

/**
 * @description ステージエリアのロックボタンのポインターダウンイベント処理関数
 *              Stage area lock button pointer down event processing function
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.button !== 0
        || $activeTouchPointers.size > 1
    ) {
        return ;
    }

    const element = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    // メニューを全て非表示にする
    $allHideMenu();

    // 編集中のinputを終了する
    $setEditingElement(null);

    // イベントの伝播を止める
    event.stopPropagation();

    // フラグの切り替え
    stageSetting.lock = !stageSetting.lock;

    const iconElement = element.firstElementChild as HTMLElement;
    iconElement.setAttribute("class", stageSetting.lock ? "active" : "disable");
};