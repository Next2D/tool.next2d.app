import type { ToolImpl } from "../../../../interface/ToolImpl";
import { $allHide } from "../../../../menu/application/MenuUtil";
import { $setActiveTool } from "../../ToolUtil";

/**
 * @description ユーザー設定ツールの選択時のユースケース
 *              Use cases when selecting user configuration tools
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: PointerEvent, tool: ToolImpl<any>): void =>
{
    // 親のイベントを中止する
    event.stopPropagation();

    // メニューを全て非表示にする
    $allHide();

    // アクティブツールを入れ替える
    $setActiveTool(tool);
};