import type { ILayerMode } from "@/interface/ILayerMode";
import type { ILayerType } from "@/interface/ILayerType";

/**
 * @description 通常レイヤーのモード値
 *              Normal layer mode value
 *
 * @type {number}
 * @constant
 */
export const $NORMAL_MODE: ILayerMode = 0;

/**
 * @description マスクレイヤーのモード値
 *              Mask layer mode value
 *
 * @type {number}
 * @constant
 */
export const $MASK_MODE: ILayerMode = 1;

/**
 * @description マスクの子レイヤーのモード値
 *              Mode value of child layer of mask
 *
 * @type {number}
 * @constant
 */
export const $MASK_IN_MODE: ILayerMode = 2;

/**
 * @description ガイドレイヤーのモード値
 *              Guide layer mode value
 *
 * @type {number}
 * @constant
 */
export const $GUIDE_MODE: ILayerMode = 3;

/**
 * @description ガイドの子レイヤーのモード値
 *              Mode value of child layer of guide
 *
 * @type {number}
 * @constant
 */
export const $GUIDE_IN_MODE: ILayerMode = 4;

/**
 * @description 通常レイヤーのタイプ値
 *              Normal layer type value
 *
 * @type {number}
 * @constant
 */
export const $NORMAL_TYPE: ILayerType = "normal";

/**
 * @description マスクレイヤーのタイプ値
 *              Mask layer type value
 *
 * @type {number}
 * @constant
 */
export const $MASK_TYPE: ILayerType = "mask";

/**
 * @description マスクの子レイヤーのタイプ値
 *              Mode value of child layer of mask
 *
 * @type {number}
 * @constant
 */
export const $MASK_IN_TYPE: ILayerType = "mask_in";

/**
 * @description ガイドレイヤーのタイプ値
 *              Guide layer type value
 *
 * @type {number}
 * @constant
 */
export const $GUIDE_TYPE: ILayerType = "guide";

/**
 * @description ガイドの子レイヤーのタイプ値
 *              Mode value of child layer of guide
 *
 * @type {number}
 * @constant
 */
export const $GUIDE_IN_TYPE: ILayerType = "guide_in";