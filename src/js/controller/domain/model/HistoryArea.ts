import { execute as historyAreaScrollInitializeRegisterEventUseCase } from "@/controller/application/HistoryAreaScroll/usecase/HistoryAreaScrollInitializeRegisterEventUseCase";

/**
 * @description 履歴エリアの管理クラス
 *              History area management class
 *
 * @class
 * @public
 */
class HistoryArea
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
        historyAreaScrollInitializeRegisterEventUseCase();
    }
}

export const historyArea = new HistoryArea();