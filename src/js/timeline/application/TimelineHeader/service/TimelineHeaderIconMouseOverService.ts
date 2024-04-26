import {
    $TIMELINE_HEADER_LABEL_INDEX,
    $TIMELINE_HEADER_SCRIPT_INDEX,
    $TIMELINE_HEADER_SOUND_INDEX
} from "@/config/TimelineConfig";
import {
    $getMoveIconFrame,
    $getMoveIconType,
    $setDestIconFrame
} from "../../TimelineUtil";

/**
 * @description マウスオーバーイベントを実行する
 *              Execute mouse over event
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent): void =>
{
    // 移動変数がない場合は処理しない
    const moveIconType = $getMoveIconType();
    if (!moveIconType || !$getMoveIconFrame()) {
        return ;
    }

    // 全てのイベントをキャンセル
    event.stopPropagation();
    event.preventDefault();

    const element = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    // 移動先のフレームをセット
    $setDestIconFrame(parseInt(element.dataset.frame as string));

    switch (moveIconType) {

        case "script":
            {
                const node = element.children[$TIMELINE_HEADER_SCRIPT_INDEX] as HTMLElement;
                if (!node) {
                    return ;
                }
                node.style.backgroundColor = "#3692f0";
            }
            break;

        case "label":
            {
                const node = element.children[$TIMELINE_HEADER_LABEL_INDEX] as HTMLElement;
                if (!node) {
                    return ;
                }
                node.style.backgroundColor = "#3692f0";
            }
            break;

        case "sound":
            {
                const node = element.children[$TIMELINE_HEADER_SOUND_INDEX] as HTMLElement;
                if (!node) {
                    return ;
                }
                node.style.backgroundColor = "#3692f0";
            }
            break;

        default:
            break;
    }
};