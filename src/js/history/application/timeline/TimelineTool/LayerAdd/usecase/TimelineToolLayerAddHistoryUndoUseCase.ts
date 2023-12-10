import type { Layer } from "@/core/domain/model/Layer";

/**
 * @description レイヤー追加作業を元に戻す
 *              Undo the layer addition process
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (layer: Layer): void =>
{
    console.log(layer);
};