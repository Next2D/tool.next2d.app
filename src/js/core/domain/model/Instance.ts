import type { InstanceTypeImpl } from "@/interface/InstanceTypeImpl";
import type { ObjectImpl } from "@/interface/ObjectImpl";
import { WorkSpace } from "./WorkSpace";
import { execute as instanceGetPathNameService } from "@/core/application/Instance/service/InstanceGetPathNameService";

/**
 * @description ライブラリのアイテムの親クラス
 *              Parent class of the item in the library
 *
 * @class
 * @public
 */
export class Instance
{
    private readonly _$id: number;
    private _$name: string;
    private _$type: InstanceTypeImpl;
    private _$symbol: string;
    private _$folderId: number;

    /**
     * @param {object} object
     * @constructor
     * @public
     */
    constructor (object: ObjectImpl<any>)
    {
        /**
         * @type {number}
         * @private
         */
        this._$id = object.id;

        /**
         * @type {string}
         * @private
         */
        this._$type = object.type;

        /**
         * @type {string}
         * @private
         */
        this._$name = object.name || "";

        /**
         * @type {string}
         * @private
         */
        this._$symbol = object.symbol || "";

        /**
         * @type {number}
         * @private
         */
        this._$folderId = object.folderId || 0;
    }

    /**
     * @description インスタンスのユニークIDを返却
     *              Return the unique ID of the instance
     *
     * @returns {number}
     * @readonly
     * @public
     */
    get id (): number
    {
        return this._$id;
    }

    /**
     * @description インスタンスタイプ
     *              instance type
     *
     * @returns {string}
     * @readonly
     * @public
     */
    get type (): InstanceTypeImpl
    {
        return this._$type;
    }

    /**
     * @description フォルダを含めたライブラリのパスを返す
     *              Returns the path to the library, including folders
     *
     * @param  {WorkSpace} work_space
     * @return {string}
     * @method
     * @public
     */
    getPath (work_space: WorkSpace): string
    {
        return instanceGetPathNameService(work_space, this);
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
        return this._$name;
    }
    set name (name: string)
    {
        this._$name = name;
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
        return this._$symbol;
    }
    set symbol (symbol: string)
    {
        this._$symbol = symbol;
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
        return this._$folderId;
    }
    set folderId (folder_id: number)
    {
        this._$folderId = folder_id;
    }
}