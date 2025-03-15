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
    /**
     * @description スクロールスケールを返却
     *              Returns the scroll scale
     *
     * @member {number}
     * @default 1
     * @public
     */
    public scrollScale: number;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this.scrollScale = 1;
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