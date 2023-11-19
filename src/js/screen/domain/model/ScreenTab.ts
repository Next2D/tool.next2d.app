import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as screenTabInitializeUseCase } from "../../application/ScreenTab/usecase/ScreenTabInitializeUseCase";
import { execute as screenTabGetElementService } from "../../application/ScreenTab/service/ScreenTabGetElementService";
import { execute as screenTabActiveElementService } from "../../application/ScreenTab/service/ScreenTabActiveElementService";
import { execute as screenTabDisableElementService } from "../../application/ScreenTab/service/ScreenTabDisableElementService";
import { execute as screenTabRemoveElementService } from "../../application/ScreenTab/service/ScreenTabRemoveElementService";

/**
 * @description アローツールの管理クラス
 *              ArrowTools Management Class
 *
 * @class
 * @public
 */
export class ScreenTab
{
    private readonly _$workSpace: WorkSpace;

    /**
     * @param {WorkSpace} work_space
     * @constructor
     * @public
     */
    constructor (work_space: WorkSpace)
    {
        this._$workSpace = work_space;
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
        screenTabInitializeUseCase(this._$workSpace);
    }

    /**
     * @description タブの削除処理
     *              Tab deletion process
     *
     * @return {void}
     * @method
     * @public
     */
    remove (): void
    {
        screenTabRemoveElementService(this._$workSpace.id);
    }

    /**
     * @description アクティブ表示に変更
     *              Change to active view
     *
     * @return {void}
     * @method
     * @public
     */
    active (): void
    {
        const element: HTMLElement | null = screenTabGetElementService(this._$workSpace.id);
        if (!element) {
            return ;
        }
        screenTabActiveElementService(element);
    }

    /**
     * @description 非アクティブの表示に変更
     *              Changed to show inactive
     *
     * @return {void}
     * @method
     * @public
     */
    disable (): void
    {
        const element: HTMLElement | null = screenTabGetElementService(this._$workSpace.id);
        if (!element) {
            return ;
        }
        screenTabDisableElementService(element);
    }
}