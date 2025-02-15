import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { IInstanceType } from "@/interface/IInstanceType";
import type { Instance } from "@/core/domain/model/Instance";
import { execute as externalItemUpdateNameUseCase } from "@/external/core/application/ExternalItem/usecase/ExternalItemUpdateNameUseCase";
import { execute as externalItemUpdateSymbolUseCase } from "@/external/core/application/ExternalItem/usecase/ExternalItemUpdateSymbolUseCase";
import { execute as externalItemRemoveUseCase } from "@/external/core/application/ExternalItem/usecase/ExternalItemRemoveUseCase";

/**
 * @class
 */
export class ExternalItem<I extends Instance = Instance>
{
    protected readonly _$instance: I;
    protected readonly _$workSpace: WorkSpace;

    /**
     * @param {WorkSpace} work_space
     * @param {Instance} instance
     * @constructor
     * @public
     */
    constructor (work_space: WorkSpace, instance: I)
    {
        /**
         * @type {WorkSpace}
         * @private
         */
        this._$workSpace = work_space;

        /**
         * @type {ExternalItem}
         * @private
         */
        this._$instance = instance;
    }

    /**
     * @description アイテムの識別ID
     *              Item Identification ID
     *
     * @return {number}
     * @readonly
     * @public
     */
    get id (): number
    {
        return this._$instance.id;
    }

    /**
     * @description アイテムの識別ID
     *              Item Identification ID
     *
     * @return {number}
     * @readonly
     * @public
     */
    get type (): IInstanceType
    {
        return this._$instance.type;
    }

    /**
     * @description ライブラリ一覧に表示されるインスタンス名を返却
     *              Returns the instance name displayed in the library list
     *
     * @return {string}
     * @method
     * @public
     */
    getName (): string
    {
        return this._$instance.name;
    }

    /**
     * @description ライブラリ一覧に表示されるインスタンス名を設定
     *              Set the instance name displayed in the library list
     *
     * @param {string} name
     * @return {Promise<void>}
     * @method
     * @public
     */
    async setName (name: string): Promise<void>
    {
        await externalItemUpdateNameUseCase(
            this._$workSpace,
            this._$workSpace.scene,
            this._$instance,
            name
        );
    }

    /**
     * @description ライブラリ一覧で設定したシンボル名を返却
     *              Returns the symbol name set in the library list
     *
     * @return {string}
     * @method
     * @public
     */
    getSymbol (): string
    {
        return this._$instance.symbol;
    }

    /**
     * @description ライブラリ一覧で設定したシンボル名を設定
     *              Set the symbol name set in the library list
     *
     * @param  {string} symbol
     * @return {Promise<void>}
     * @method
     * @public
     */
    async setSymbol (symbol: string): Promise<void>
    {
        // todo await
        await externalItemUpdateSymbolUseCase(
            this._$workSpace,
            this._$workSpace.scene,
            this._$instance,
            symbol
        );
    }

    /**
     * @description 親フォルダのID
     *              ID of parent folder
     *
     * @member {number}
     * @public
     */
    get folderId (): number
    {
        return this._$instance.folderId;
    }
    set folderId (folder_id: number)
    {
        this._$instance.folderId = folder_id;
    }

    /**
     * @description ファイルパス
     *              File path
     *
     * @member {string}
     * @readonly
     * @public
     */
    get path (): string
    {
        return this._$instance.getPath(this._$workSpace);
    }

    /**
     * @description アイテムをライブラリエリアから削除
     *              ID of parent folder
     *
     * @param  {boolean} [reload = true]
     * @return {Promise}
     * @method
     * @public
     */
    async remove (reload: boolean = true): Promise<void>
    {
        await externalItemRemoveUseCase(
            this._$workSpace, this._$instance, reload
        );
    }
}