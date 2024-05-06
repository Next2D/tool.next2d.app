import type { PositionImpl } from "@/interface/PositionImpl";
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
    private _$sizeLocked: boolean;
    private _$scaleLocked: boolean;
    private _$beforeValue: number;
    private readonly _$movePosition: PositionImpl;

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
         * @type {object}
         * @private
         */
        this._$movePosition = {
            "x": 0,
            "y": 0
        };
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
     * @description 移動座標を返却
     *              Return the move coordinates
     *
     * @member {object}
     * @public
     */
    get movePosition (): PositionImpl
    {
        return this._$movePosition;
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