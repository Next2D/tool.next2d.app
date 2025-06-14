/**
 * @type {string}
 * @private
 */
let $referencePointState: "hide" | "show" = "hide";

/**
 * @description 基準点のElementの表示状態を返却
 *              Returns the display state of the standard point Element
 *
 * @return {"hide" | "show"}
 * @method
 * @public
 */
export const $getReferencePointState = (): "hide" | "show" =>
{
    return $referencePointState;
};

/**
 * @description 基準点のElementの表示状態を更新
 *              Update the display state of the reference point Element
 *
 * @return {"hide" | "show"}
 * @method
 * @public
 */
export const $setReferencePointState = (state: "hide" | "show"): void =>
{
    $referencePointState = state;
};