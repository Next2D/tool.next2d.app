import type { ITool } from "@/interface/ITool";
import { EventType } from "../domain/event/EventType";

/**
 * @description BaseToolを継承してる、現在選択中のToolオブジェクト
 *              Tool object currently selected that inherits from BaseTool
 *
 * @private
 */
let $activeTool: ITool<any> | null = null;

/**
 * @description 現在、選択中のToolオブジェクトを返却
 *              Returns the currently selected Tool object
 *
 * @return {BaseTool}
 * @method
 * @public
 */
export const $getActiveTool = (): ITool<any> | null =>
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
export const $setActiveTool = (tool: ITool<any>): void =>
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
const $defaultTools: Map<string, ITool<any>> = new Map();

/**
 * @description デフォルトのToolオブジェクトをマップに登録
 *              Register Tool object to map
 *
 * @param  {BaseTool} tool
 * @return {void}
 * @method
 * @public
 */
export const $registerDefaultTool = (tool: ITool<any>): void =>
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
export const $getDefaultTool = (name: string): ITool<any> | null =>
{
    return $defaultTools.has(name)
        ? $defaultTools.get(name)
        : null;
};

/**
 * @description ツールエリアでのマウス状態
 *              Mouse state in tool area
 *
 * @private
 */
let $mouseState: "up" | "down" = "up";

/**
 * @description ツールエリアでのマウス状態を取得
 *              Get mouse status in tool area
 *
 * @return {string}
 * @method
 * @public
 */
export const $getMouseState = (): "up" | "down" =>
{
    return $mouseState;
};

/**
 * @description ツールエリアでのマウス状態を更新
 *              Update mouse status in tool area
 *
 * @param  {string} state
 * @return {void}
 * @method
 * @public
 */
export const $setMouseState = (state: "up" | "down"): void =>
{
    $mouseState = state;
};