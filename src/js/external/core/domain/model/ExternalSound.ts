import { ExternalItem } from "./ExternalItem";

/**
 * @description 画像アイテムのクラス
 *              Image Item Class
 *
 * @class
 * @public
 */
export class ExternalSound extends ExternalItem
{

    /**
     * @description 音量調整
     *              Volume adjustment
     *
     * @type {number}
     * @public
     */
    get volume(): number
    {
        return this._$instance._volume;
    }
    set volume (volume: number)
    {
        this._$instance._volume = volume;
    }
}