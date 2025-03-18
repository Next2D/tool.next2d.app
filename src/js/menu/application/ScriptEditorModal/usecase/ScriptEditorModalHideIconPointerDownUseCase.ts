import { $activeTouchPointers } from "@/global/GlobalUtil";
import { execute as scriptEditorModalHideService } from "../service/ScriptEditorModalHideService";

/**
 * @description スクリプトエディタの閉じるボタン実行処理関数
 *              Script Editor Close Button Execution Processing Function
 *
 * @param  {PointerEvent} event
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (event: PointerEvent): Promise<void> =>
{
    if (event.button !== 0
        || $activeTouchPointers.size > 1
    ) {
        return ;
    }

    // 他のイベントを中止
    event.stopPropagation();
    event.preventDefault();

    // スクリプトエディターを非表示にする
    await scriptEditorModalHideService();
};