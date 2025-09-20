import type { IPivotType } from "@/interface/IPivotType";
import type { IReferencePositionSaveObject } from "@/interface/IReferencePositionSaveObject";
import type { Character } from "./Character";
import { execute as referencePositionGetPositionService } from "@/core/application/ReferencePosition/service/ReferencePositionGetPositionService";
import { execute as referencePositionGetRawPositionService } from "@/core/application/ReferencePosition/service/ReferencePositionGetRawPositionService";
import { IPosition } from "@/interface/IPosition";

/**
 * @description 中心点の位置情報クラス
 *              Position information class for the center point
 *
 * @class
 * @public
 */
export class ReferencePosition
{
    /**
     * @description 中心点のx座標、pivotが指定されている時は描画領域の特定のx座標を返却
     *              The x coordinate of the center point, when pivot is specified, returns a specific x coordinate of the drawing area
     *
     * @member {number}
     * @private
     */
    private _$x: number;

    /**
     * @description 中心点のy座標、pivotが指定されている時は描画領域の特定のy座標を返却
     *              The y coordinate of the center point, when pivot is specified, returns a specific y coordinate of the drawing area
     *
     * @member {number}
     * @private
     */
    private _$y: number;

    /**
     * @description 中心点の位置
     *              The position of the center point
     *
     * @member {IPivotType}
     * @public
     */
    public pivot: IPivotType;

    /**
     * @description この中心点のElementを持つCharacter
     *              The Character that has the Element of this center point
     *
     * @member {Character}
     * @public
     */
    public readonly _$character: Character;

    /**
     * @constructor
     */
    constructor (character: Character)
    {
        this._$character = character;
        this._$x         = 0;
        this._$y         = 0;
        this.pivot       = "middle-center";
    }

    /**
     * @description 中心点のx座標を返却
     *              Returns the x coordinate of the center point
     *
     * @returns {number}
     * @method
     * @public
     */
    get x (): number
    {
        return referencePositionGetPositionService(
            this.pivot, this._$x, this._$y, this._$character
        ).x;
    }
    set x (x: number)
    {
        this._$x = x;
    }

    /**
     * @description 中心点のy座標を返却
     *              Returns the y coordinate of the center point
     *
     * @returns {number}
     * @method
     * @public
     */
    get y (): number
    {
        return referencePositionGetPositionService(
            this.pivot, this._$x, this._$y, this._$character
        ).y;
    }
    set y (y: number)
    {
        this._$y = y;
    }

    /**
     * @description ローカル座標を返却
     *              Returns local coordinates
     *
     * @returns {IPosition}
     * @method
     * @public
     */
    getLocalPosition (): IPosition
    {
        return referencePositionGetRawPositionService(
            this.pivot, this._$x, this._$y, this._$character
        );
    }

    /**
     * @description 保存用のオブジェクトを返却
     *              Returns an object for saving
     *
     * @returns {IReferencePositionSaveObject}
     * @method
     * @public
     */
    toObject (): IReferencePositionSaveObject
    {
        return {
            "x": this.pivot ? 0 : this._$x,
            "y": this.pivot ? 0 : this._$y,
            "pivot": this.pivot
        };
    }
}