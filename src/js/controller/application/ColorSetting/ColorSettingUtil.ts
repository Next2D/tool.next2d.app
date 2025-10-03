/**
 * @description カラー設定エリアのポインターの状態
 *              Pointer state of the color setting area
 *
 * @type {"up" | "down"}
 * @default "up"
 * @private
 */
let state: "up" | "down" = "up";

/**
 * @description カラー設定エリアのポインターの状態を取得
 *              Get the pointer state of the color setting area
 *
 * @return {"up" | "down"}
 * @method
 * @public
 */
export const $getColorSettingState = (): "up" | "down" =>
{
    return state;
};

/**
 * @description カラー設定エリアのポインターの状態を設定
 *              Set the pointer state of the color setting area
 *
 * @param value "up" | "down"
 * @return {void}
 * @method
 * @public
 */
export const $setColorSettingState = (value: "up" | "down"): void =>
{
    state = value;
};