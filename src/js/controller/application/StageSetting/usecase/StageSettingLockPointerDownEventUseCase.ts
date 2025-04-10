import { stageSetting } from "@/controller/domain/model/StageSetting";
import { $activeTouchPointers, $setEditingElement } from "@/global/GlobalUtil";
import { $allHideMenu } from "@/menu/application/MenuUtil";

/**
 * @description ステージエリアのロックボタンのマウスダウンイベントユースケース
 *              Mouse down event use case for the lock button of the stage area
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