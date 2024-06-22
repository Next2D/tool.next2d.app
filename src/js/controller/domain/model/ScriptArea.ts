import { execute as scriptAreaScrollInitializeRegisterEventUseCase } from "@/controller/application/ScriptAreaScroll/usecase/ScriptAreaScrollInitializeRegisterEventUseCase";

/**
 * @description JSエリアの管理クラス
 *              JS area management class
 *
 * @class
 * @public
 */
class ScriptArea
{
    private _$scrollScale: number;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$scrollScale = 1;
    }

    /**
     * @description スクロールスケールを返却
     *              Returns the scroll scale
     *
     * @member {number}
     * @public
     */
    get scrollScale (): number
    {
        return this._$scrollScale;
    }
    set scrollScale (scroll_scale: number)
    {
        this._$scrollScale = scroll_scale;
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
        scriptAreaScrollInitializeRegisterEventUseCase();
    }
}

export const scriptArea = new ScriptArea();