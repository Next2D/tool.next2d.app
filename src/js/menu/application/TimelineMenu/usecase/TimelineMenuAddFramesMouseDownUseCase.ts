import { $allHideMenu } from "../../MenuUtil";
import { execute as timelineToolInsertFramesUseCase } from "@/timeline/application/TimelineTool/application/InsertFrames/usecase/TimelineToolInsertFramesUseCase";
import { $setEditingElement } from "@/global/GlobalUtil";

/**
 * @description タイムラインメニューのフレーム追加ボタンのマウスダウンイベント
 *              Mouse down event of the frame add button in the timeline menu
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    if (event.button !== 0) {
        return ;
    }

    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // メニューを非表示にする
    $allHideMenu();

    // 編集中のElementを初期化
    $setEditingElement(null);

    // フレームを追加する
    timelineToolInsertFramesUseCase();
};