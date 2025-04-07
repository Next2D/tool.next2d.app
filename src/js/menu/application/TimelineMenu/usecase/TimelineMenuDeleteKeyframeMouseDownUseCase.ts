import { $allHideMenu } from "../../MenuUtil";
import { execute as timelineToolDeleteKeyframeUseCase } from "@/timeline/application/TimelineTool/application/DeleteKeyframe/usecase/TimelineToolDeleteKeyframeUseCase";
import { $setEditingElement } from "@/global/GlobalUtil";

/**
 * @description タイムラインメニューのキーフレーム削除ボタンのマウスダウンイベント
 *              Mouse down event of the keyframe delete button in the timeline menu
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

    // メニューを非表示にする
    $allHideMenu();

    // 編集中のElementを初期化
    $setEditingElement(null);

    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    // キーフレームを削除する
    timelineToolDeleteKeyframeUseCase();
};