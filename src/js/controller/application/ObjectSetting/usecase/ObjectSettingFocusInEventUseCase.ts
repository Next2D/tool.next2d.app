import { $updateKeyLock } from "@/shortcut/ShortcutUtil";
import { $setEditingElement } from "@/global/GlobalUtil";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";
import { execute as timelineToolPlayStopUseCase } from "@/timeline/application/TimelineTool/application/PlayStop/usecase/TimelineToolPlayStopUseCase";

/**
 * @description ステージの幅設定のフォーカスイベント処理
 *              Focus event processing of stage width setting
 *
 * @param  {FocusEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: FocusEvent): void =>
{
    // フォーカスを初期化
    const element: HTMLInputElement | null = event.currentTarget as HTMLInputElement;
    if (!element) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();

    if (!timelineHeader.stopFlag) {
        timelineToolPlayStopUseCase();
    }

    // 入力モードをOnにする
    $updateKeyLock(true);

    // 編集中の要素を設定
    $setEditingElement(element);

    element.style.cursor = "";
};