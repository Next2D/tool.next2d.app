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
    /**
     * @description 変形エリアのx座標を返却
     *              Return the x coordinate of the transformation area
     *
     * @member {number}
     * @public
     */
    public x: number;

    /**
     * @description 変形エリアのy座標を返却
     *              Return the y coordinate of the transformation area
     *
     * @member {number}
     * @public
     */
    public y: number;

    /**
     * @description 変形エリアの幅を返却
     *              Return the width of the transformation area
     *
     * @member {number}
     * @public
     */
    public w: number;

    /**
     * @description 変形エリアの高さを返却
     *              Return the height of the transformation area
     *
     * @member {number}
     * @public
     */
    public h: number;

    /**
     * @description サイズのロック状態を返却
     *              Return the lock state of the size
     *
     * @member {boolean}
     * @public
     */
    public sizeLocked: boolean;

    /**
     * @description スケールのロック状態を返却
     *              Return the lock state of the scale
     *
     * @member {boolean}
     * @public
     */
    public scaleLocked: boolean;

    /**
     * @description 変形エリアの変更前のinput値を返却
     *              Get the lock state of the transformation scale
     *
     * @member {number}
     * @public
     */
    public beforeValue: number;

    /**
     * @description 移動する前のxy座標を返却
     *              Return the xy coordinates before moving
     *
     * @member {object}
     * @public
     */
    public readonly tempPosition: IPosition;

    /**
     * @description 変形行列を行う前のmatrix配列
     *              The matrix array before performing the transformation matrix
     *
     * @member {Array}
     * @public
     */
    public readonly matrixs: Array<number[]>;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;

        this.sizeLocked  = false;
        this.scaleLocked = false;
        this.beforeValue = 0;

        this.matrixs = [];
        this.tempPosition = {
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
}

export const transformSetting = new TransformSetting();