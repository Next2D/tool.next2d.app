import { $allHideMenu } from "../../MenuUtil";
import { execute as timelineToolEraseFramesUseCase } from "@/timeline/application/TimelineTool/application/EraseFrames/usecase/TimelineToolEraseFramesUseCase";
import { $setEditingElement } from "@/global/GlobalUtil";

/**
 * @description タイムラインメニューのフレーム削除ボタンのマウスダウンイベント
 *              Mouse down event of the frame delete button in the timeline menu
 *
 * @param  {PointerEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    if (event.button !== 0) {
        return ;
    }

    // メニューを非表示にする
    $allHideMenu();

    // 編集中のElementを初期化
    $setEditingElement(null);

    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // フレームを削除する
    await timelineToolEraseFramesUseCase();
};