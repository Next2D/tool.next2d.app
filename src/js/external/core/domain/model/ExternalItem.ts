import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { InstanceImpl } from "@/interface/InstanceImpl";
import type { InstanceTypeImpl } from "@/interface/InstanceTypeImpl";
import { execute as externalItemUpdateNameUseCase } from "@/external/core/application/ExternalItem/usecase/ExternalItemUpdateNameUseCase";

/**
 * @class
 */
export class ExternalItem
{
    protected readonly _$instance: InstanceImpl<any>;
    protected readonly _$workSpace: WorkSpace;

    /**
     * @param {WorkSpace} work_space
     * @param {Instance} instance
     * @constructor
     * @public
     */
    constructor (work_space: WorkSpace, instance: InstanceImpl<any>)
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
    get type (): InstanceTypeImpl
    {
        return this._$instance.type;
    }

    /**
     * @description ライブラリ一覧に表示されるインスタンス名
     *              Instance name as it appears in the library list
     *
     * @member {string}
     * @public
     */
    get name (): string
    {
        return this._$instance.name;
    }
    set name (name: string)
    {
        externalItemUpdateNameUseCase(
            this._$workSpace,
            this._$workSpace.scene,
            this._$instance,
            name
        );
    }

    /**
     * @description ライブラリ一覧で設定したシンボル名
     *              Symbol name set in the library list
     *
     * @member {string}
     * @public
     */
    get symbol (): string
    {
        return this._$instance.symbol;
    }
    set symbol (symbol: string)
    {
        this._$instance.symbol = symbol;
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
}