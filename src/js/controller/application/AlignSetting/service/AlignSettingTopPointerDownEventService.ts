import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalAlign } from "@/external/controller/domain/model/ExternalAlign";
import { $activeTouchPointers, $setEditingElement } from "@/global/GlobalUtil";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { EventType } from "@/tool/domain/event/EventType";

/**
 * @description 選択範囲の上端に合わせて選択中のキャラクターを移動
 *              Move the selected character to the top of the selection
 *
 * @param  {PointerEvent | KeyboardEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent | KeyboardEvent): Promise<void> =>
{
    // 左クリック以外、またはマルチタッチの場合は処理を行わない
    if (event.type === EventType.POINTER_DOWN && (event as PointerEvent).button !== 0
        || $activeTouchPointers.size > 1
    ) {
        return ;
    }

    const workSpace = $getCurrentWorkSpace();
    const movieClip = workSpace.scene;
    if (!movieClip.selectedDepths.size) {
        return ;
    }

    // メニューを閉じる
    $allHideMenu();

    // 編集中の要素を解除
    $setEditingElement(null);

    // イベントのバブリングを停止
    event.stopPropagation();

    // 選択範囲の上端に合わせて選択中のキャラクターを移動
    const externalAlign = new ExternalAlign(workSpace, movieClip);
    await externalAlign.top();
};