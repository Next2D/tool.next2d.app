import { InstanceObjectImpl } from "../../../../interface/InstanceObjectImpl";

type ObjectImpl<T extends InstanceObjectImpl> = T;

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
    private _$type: string;
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
        this._$name = object.name;

        /**
         * @type {string}
         * @private
         */
        this._$type = object.type;

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
     * @description アイテムのユニークIDを返却
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
     * @description
     *
     * @member {string}
     * @public
     */
    get name (): string
    {
        return this._$name;
    }
    set name (name :string)
    {
        this._$name = name;
    }

    /**
     * @description
     *
     * @member {string}
     * @public
     */
    get type (): string
    {
        return this._$type;
    }
    set type (type :string)
    {
        this._$type = type;
    }

    /**
     * @description
     *
     * @member {string}
     * @public
     */
    get symbol (): string
    {
        return this._$symbol;
    }
    set symbol (symbol :string)
    {
        this._$symbol = symbol;
    }

    /**
     * @description
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