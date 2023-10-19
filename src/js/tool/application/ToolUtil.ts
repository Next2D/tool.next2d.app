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

/**
 * @description ツールエリアの移動状態
 *              Movement state of tool area
 *
 * @private
 */
let $toolAreaState: "move" | "fixed" = "fixed";

/**
 * @description ツールエリアでの移動状態を取得
 *              Get move status in tool area
 *
 * @return {string}
 * @method
 * @public
 */
export const $getToolAreaState = (): "move" | "fixed" =>
{
    return $toolAreaState;
};

/**
 * @description ツールエリアでの移動状態を更新
 *              Update movement status in tool area
 *
 * @param  {string} state
 * @return {void}
 * @method
 * @public
 */
export const $setToolAreaState = (state: "move" | "fixed"): void =>
{
    $toolAreaState = state;
};

/**
 * @description ツールエリアの移動待機状態
 *              Tool area in standby for movement
 *
 * @private
 */
let $standbyMove: boolean = false;

/**
 * @description ツールエリアの移動待機状態を取得
 *              Obtains the move standby status of the tool area
 *
 * @return {boolean}
 * @method
 * @public
 */
export const $getStandbyMoveState = (): boolean =>
{
    return $standbyMove;
};

/**
 * @description ツールエリアの移動待機状態を更新
 *              Update tool area move standby status
 *
 * @return {boolean}
 * @method
 * @public
 */
export const $setStandbyMoveState = (state: boolean): void =>
{
    $standbyMove = state;
};