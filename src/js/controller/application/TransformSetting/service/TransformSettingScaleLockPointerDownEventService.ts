import { transformSetting } from "@/controller/domain/model/TransformSetting";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import {
    $activeTouchPointers,
    $setEditingElement
} from "@/global/GlobalUtil";

/**
 * @description スケールロックのポインターダウンイベント関数
 *              Scale Lock Pointer Down Event Function
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

    // 編集中のElementを初期化
    $setEditingElement(null);

    // 親のイベントをキャンセルする
    event.stopPropagation();

    // ロックの状態を変更する
    transformSetting.scaleLocked = !transformSetting.scaleLocked;

    const scaleLockElement = element.firstElementChild as HTMLElement;
    scaleLockElement.setAttribute("class", transformSetting.scaleLocked ? "active" : "disable");
};