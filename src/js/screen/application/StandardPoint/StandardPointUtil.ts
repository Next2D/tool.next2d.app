/**
 * @type {string}
 * @private
 */
let $standardPointState: "hide" | "show" = "hide";

/**
 * @description 基準点のElementの表示状態を返却
 *              Returns the display state of the standard point Element
 *
 * @return {"hide" | "show"}
 * @method
 * @public
 */
export const $getStandardPointState = (): "hide" | "show" =>
{
    return $standardPointState;
};

/**
 * @description 基準点のElementの表示状態を更新
 *              Update the display state of the standard point Element
 *
 * @return {"hide" | "show"}
 * @method
 * @public
 */
export const $setStandardPointState = (state: "hide" | "show"): void =>
{
    $standardPointState = state;
};

/**
 * @type {string}
 * @private
 */
let $parentStandardPointState: "hide" | "show" = "hide";

/**
 * @description 親の基準点のElementの表示状態を返却
 *              Returns the display state of the standard point Element
 *
 * @return {"hide" | "show"}
 * @method
 * @public
 */
export const $getParentStandardPointState = (): "hide" | "show" =>
{
    return $parentStandardPointState;
};

/**
 * @description 親の基準点のElementの表示状態を更新
 *              Update the display state of the standard point Element
 *
 * @return {"hide" | "show"}
 * @method
 * @public
 */
export const $setParentStandardPointState = (state: "hide" | "show"): void =>
{
    $parentStandardPointState = state;
};