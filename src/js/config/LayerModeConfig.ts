import type { LayerModeImpl } from "@/interface/LayerModeImpl";
import type { LayerTypeImpl } from "@/interface/LayerTypeImpl";

/**
 * @description 通常レイヤーのモード値
 *              Normal layer mode value
 *
 * @type {number}
 * @constant
 */
export const $NORMAL_MODE: LayerModeImpl = 0;

/**
 * @description マスクレイヤーのモード値
 *              Mask layer mode value
 *
 * @type {number}
 * @constant
 */
export const $MASK_MODE: LayerModeImpl = 1;

/**
 * @description マスクの子レイヤーのモード値
 *              Mode value of child layer of mask
 *
 * @type {number}
 * @constant
 */
export const $MASK_IN_MODE: LayerModeImpl = 2;

/**
 * @description ガイドレイヤーのモード値
 *              Guide layer mode value
 *
 * @type {number}
 * @constant
 */
export const $GUIDE_MODE: LayerModeImpl = 3;

/**
 * @description ガイドの子レイヤーのモード値
 *              Mode value of child layer of guide
 *
 * @type {number}
 * @constant
 */
export const $GUIDE_IN_MODE: LayerModeImpl = 4;

/**
 * @description 通常レイヤーのタイプ値
 *              Normal layer type value
 *
 * @type {number}
 * @constant
 */
export const $NORMAL_TYPE: LayerTypeImpl = "normal";

/**
 * @description マスクレイヤーのタイプ値
 *              Mask layer type value
 *
 * @type {number}
 * @constant
 */
export const $MASK_TYPE: LayerTypeImpl = "mask";

/**
 * @description マスクの子レイヤーのタイプ値
 *              Mode value of child layer of mask
 *
 * @type {number}
 * @constant
 */
export const $MASK_IN_TYPE: LayerTypeImpl = "mask_in";

/**
 * @description ガイドレイヤーのタイプ値
 *              Guide layer type value
 *
 * @type {number}
 * @constant
 */
export const $GUIDE_TYPE: LayerTypeImpl = "guide";

/**
 * @description ガイドの子レイヤーのタイプ値
 *              Mode value of child layer of guide
 *
 * @type {number}
 * @constant
 */
export const $GUIDE_IN_TYPE: LayerTypeImpl = "guide_in";