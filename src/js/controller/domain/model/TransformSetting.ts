import type { IPosition } from "@/interface/IPosition";
import { execute as transformSettingInitializeRegisterEventUseCase } from "@/controller/application/TransformSetting/usecase/TransformSettingInitializeRegisterEventUseCase";

/**
 * @description 変形設定クラス
 *              Transformation setting class
 *
 * @class
 * @public
 */
class TransformSetting
{
    private _$x: number;
    private _$y: number;
    private _$w: number;
    private _$h: number;
    private _$sizeLocked: boolean;
    private _$scaleLocked: boolean;
    private _$beforeValue: number;
    private readonly _$tempPosition: IPosition;
    private readonly _$matrixs: Array<number[]>;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$sizeLocked = false;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$scaleLocked = false;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$beforeValue = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$x = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$y = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$w = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$h = 0;

        /**
         * @type {object}
         * @private
         */
        this._$tempPosition = {
            "x": 0,
            "y": 0
        };

        /**
         * @type {Array}
         * @private
         */
        this._$matrixs = [];
    }

    /**
     * @description 初期起動関数
     *              initial invoking function
     *
     * @return {void}
     * @method
     * @public
     */
    initialize (): void
    {
        transformSettingInitializeRegisterEventUseCase();
    }

    /**
     * @description 変形行列を行う前のmatrix配列
     *              The matrix array before performing the transformation matrix
     *
     * @member {Array}
     * @public
     */
    get matrixs (): Array<number[]>
    {
        return this._$matrixs;
    }

    /**
     * @description 変形エリアのx座標を返却
     *              Return the x coordinate of the transformation area
     *
     * @member {number}
     * @public
     */
    get x (): number
    {
        return this._$x;
    }
    set x (x: number)
    {
        this._$x = x;
    }

    /**
     * @description 変形エリアのy座標を返却
     *              Return the y coordinate of the transformation area
     *
     * @member {number}
     * @public
     */
    get y (): number
    {
        return this._$y;
    }
    set y (y: number)
    {
        this._$y = y;
    }

    /**
     * @description 変形エリアの幅を返却
     *              Return the width of the transformation area
     *
     * @member {number}
     * @public
     */
    get w (): number
    {
        return this._$w;
    }
    set w (w: number)
    {
        this._$w = w;
    }

    /**
     * @description 変形エリアの高さを返却
     *              Return the height of the transformation area
     *
     * @member {number}
     * @public
     */
    get h (): number
    {
        return this._$h;
    }
    set h (h: number)
    {
        this._$h = h;
    }

    /**
     * @description 移動する前のxy座標を返却
     *              Return the xy coordinates before moving
     *
     * @member {object}
     * @public
     */
    get tempPosition (): IPosition
    {
        return this._$tempPosition;
    }

    /**
     * @description 変形エリアの変更前のinput値を返却
     *              Get the lock state of the transformation scale
     *
     * @member {number}
     * @public
     */
    get beforeValue (): number
    {
        return this._$beforeValue;
    }
    set beforeValue (beforeValue: number)
    {
        this._$beforeValue = beforeValue;
    }

    /**
     * @description サイズのロック状態を返却
     *              Return the lock state of the size
     *
     * @member {boolean}
     * @public
     */
    get sizeLocked (): boolean
    {
        return this._$sizeLocked;
    }
    set sizeLocked (sizeLocked: boolean)
    {
        this._$sizeLocked = sizeLocked;
    }

    /**
     * @description スケールのロック状態を返却
     *              Return the lock state of the scale
     *
     * @member {boolean}
     * @public
     */
    get scaleLocked (): boolean
    {
        return this._$scaleLocked;
    }
    set scaleLocked (scaleLocked: boolean)
    {
        this._$scaleLocked = scaleLocked;
    }
}

export const transformSetting = new TransformSetting();