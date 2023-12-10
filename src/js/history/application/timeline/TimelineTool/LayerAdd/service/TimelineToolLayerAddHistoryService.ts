import { $TIMELINE_TOOL_LAYER_ADD_COMMAD } from "@/config/HistoryConfig";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import type { Layer } from "@/core/domain/model/Layer";

/**
 * @description 新規レイヤー追加の履歴を登録
 *              Register history of adding new layers
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer: Layer): void =>
{
    // 追加したLayer Objectを履歴に登録
    const workSpace = $getCurrentWorkSpace();
    workSpace.addHistory({
        "command": $TIMELINE_TOOL_LAYER_ADD_COMMAD,
        "object": layer
    });
};