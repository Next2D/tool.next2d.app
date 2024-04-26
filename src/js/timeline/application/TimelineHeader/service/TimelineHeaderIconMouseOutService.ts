import {
    $getMoveIconFrame,
    $getMoveIconType,
    $setDestIconFrame
} from "../../TimelineUtil";
import {
    $TIMELINE_HEADER_LABEL_INDEX,
    $TIMELINE_HEADER_SCRIPT_INDEX,
    $TIMELINE_HEADER_SOUND_INDEX
} from "@/config/TimelineConfig";

/**
 * @description マウスアウトイベントを実行する
 *              Execute the mouse out event
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

    // 対象のフレームに色をつける
    const element = event.currentTarget as HTMLElement;
    if (!element) {
        return ;
    }

    // 移動先を初期化
    $setDestIconFrame(0);

    switch (moveIconType) {

        case "script":
            {
                const node = element.children[$TIMELINE_HEADER_SCRIPT_INDEX] as HTMLElement;
                if (!node) {
                    return ;
                }
                node.style.backgroundColor = "";
            }
            break;

        case "label":
            {
                const node = element.children[$TIMELINE_HEADER_LABEL_INDEX] as HTMLElement;
                if (!node) {
                    return ;
                }
                node.style.backgroundColor = "";
            }
            break;

        case "sound":
            {
                const node = element.children[$TIMELINE_HEADER_SOUND_INDEX] as HTMLElement;
                if (!node) {
                    return ;
                }
                node.style.backgroundColor = "";
            }
            break;

        default:
            break;
    }
};