import type { ToolImpl } from "../../../interface/ToolImpl";
import { execute as menuAllHideService } from "../../../menu/application/service/MenuAllHideService";
import { $setActiveTool } from "../Tool";

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
    menuAllHideService();

    // アクティブツールを入れ替える
    $setActiveTool(tool);
};