import { execute as pluginAreaScrollInitializeRegisterEventUseCase } from "@/controller/application/PluginAreaScroll/usecase/PluginAreaScrollInitializeRegisterEventUseCase";

/**
 * @description プラグインエリアの管理クラス
 *              Plugin area management class
 *
 * @class
 * @public
 */
class PluginArea
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
        pluginAreaScrollInitializeRegisterEventUseCase();
    }
}

export const pluginArea = new PluginArea();