import type { ToolImpl } from "../../../interface/ToolImpl";
import type { ArrowTool } from "../../domain/model/ArrowTool";
import { $setActiveTool } from "../Tool";

/**
 * @description アローツールの初期起動ユースケース
 *              Arrow Tool initial startup use case
 *
 * @param  {ArrowTool} tool
 * @return {void}
 * @method
 * @public
 */
export const execute = (tool: ToolImpl<ArrowTool>): void =>
{
    // TODO 各種イベントを登録

    // 初期選択ツールとしてセット
    $setActiveTool(tool);
};