import {
    $getMoveIconFrame,
    $getMoveIconType
} from "../../TimelineUtil";

/**
 * @description ドラッグオーバーイベントを実行する
 *              Execute drag over event
 *
 * @param  {DragEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: DragEvent): void =>
{
    // 移動変数がない場合は処理しない
    if (!$getMoveIconType() || !$getMoveIconFrame()) {
        return ;
    }

    // 全てのイベントをキャンセル
    event.stopPropagation();
    event.preventDefault();
};