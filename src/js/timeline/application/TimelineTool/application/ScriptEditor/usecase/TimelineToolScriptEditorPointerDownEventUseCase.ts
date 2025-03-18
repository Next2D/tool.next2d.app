import { $activeTouchPointers } from "@/global/GlobalUtil";
import { execute as scriptEditorModalCurrentBootUseCase } from "@/menu/application/ScriptEditorModal/usecase/ScriptEditorModalCurrentBootUseCase";
import { timelineHeader } from "@/timeline/domain/model/TimelineHeader";

/**
 * @description スクリプトエディタ起動ボタンのイベント処理関数
 *              Event handling function for script editor start button
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
        || !timelineHeader.stopFlag
    ) {
        return;
    }

    // 親のイベントを中止する
    event.stopPropagation();
    event.preventDefault();

    // スクリプトエディタを表示
    scriptEditorModalCurrentBootUseCase();
};