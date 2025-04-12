import { $setEditingElement } from "@/global/GlobalUtil";
import { $allHideMenu } from "@/menu/application/MenuUtil";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { execute as timelineToolPlayStopUseCase } from "@/timeline/application/TimelineTool/application/PlayStop/usecase/TimelineToolPlayStopUseCase";

/**
 * @description オブジェクト設定の名前のポインターダウンイベント関数
 *              Object setting name pointer down event function
 *
 * @param {PointerEvent} event
 * @returns {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // メニューを全て非表示にする
    $allHideMenu();

    // 編集中の要素をnullにする
    $setEditingElement(null);

    // 再生中なら、タイムラインの再生を停止する
    if (!timelineHeader.stopFlag) {
        timelineToolPlayStopUseCase();
    }

    // イベントの伝播を止める
    event.stopPropagation();
};