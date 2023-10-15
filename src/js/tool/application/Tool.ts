import type { ToolImpl } from "../../interface/ToolImpl";
import { EventType } from "../domain/event/EventType";

/**
 * @description BaseToolを継承してる、現在選択中のToolオブジェクト
 *              Tool object currently selected that inherits from BaseTool
 *
 * @private
 */
let $activeTool: ToolImpl<any> | null = null;

/**
 * @description 現在、選択中のToolオブジェクトを返却
 *              Returns the currently selected Tool object
 *
 * @return {BaseTool}
 * @method
 * @public
 */
export const $getActiveTool = (): ToolImpl<any> | null =>
{
    return $activeTool;
};

/**
 * @description 選択したToolオブジェクトをセット
 *              Set selected Tool object
 *
 * @param  {BaseTool} tool
 * @return {void}
 * @method
 * @public
 */
export const $setActiveTool = (tool: ToolImpl<any>): void =>
{
    if ($activeTool) {
        $activeTool.dispatchEvent(EventType.END);
    }

    $activeTool = tool;
    tool.dispatchEvent(EventType.START);
};

/**
 * @description Toolオブジェクトを名前でマッピンング
 *              Mapping Tool objects by name
 *
 * @private
 */
const $defaultTools: Map<string, ToolImpl<any>> = new Map();

/**
 * @description デフォルトのToolオブジェクトをマップに登録
 *              Register Tool object to map
 *
 * @param  {BaseTool} tool
 * @return {void}
 * @method
 * @public
 */
export const $registerDefaultTool = (tool: ToolImpl<any>): void =>
{
    $defaultTools.set(tool.name, tool);
};

/**
 * @description 名前を指定してToolオブジェクトを取得
 *              Get Tool object by name
 *
 * @param  {string} name
 * @return {BaseTool}
 * @method
 * @public
 */
export const $getDefaultTool = (name: string): ToolImpl<any> | null =>
{
    return $defaultTools.has(name)
        ? $defaultTools.get(name)
        : null;
};