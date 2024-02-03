import type { ObjectImpl } from "@/interface/ObjectImpl";
import type { FolderObjectImpl } from "@/interface/FolderObjectImpl";
import type { FolderTypeImpl } from "@/interface/FolderTypeImpl";
import { Instance } from "./Instance";

/**
 * @extends {Instance}
 * @class
 * @public
 */
export class Folder extends Instance
{
    private _$mode: FolderTypeImpl;

    /**
     * @param {object} object
     * @constructor
     * @public
     */
    constructor (object: ObjectImpl<FolderObjectImpl>)
    {
        super(object);

        /**
         * @type {string}
         * @private
         */
        this._$mode = object.mode || "close";
    }

    /**
     * @description フォルダの開閉状態の値を返す
     *              Returns the value of the folder's open/closed status
     *
     * @default "close"
     * @member {string}
     * @public
     */
    get mode (): FolderTypeImpl
    {
        return this._$mode;
    }
    set mode (mode: FolderTypeImpl)
    {
        this._$mode = mode;
    }

    /**
     * @description クラス内の変数をObjectにして返す
     *              Return variables in a class as Objects
     *
     * @return {object}
     * @method
     * @public
     */
    toObject (): FolderObjectImpl
    {
        return {
            "id":       this.id,
            "name":     this.name,
            "type":     this.type,
            "symbol":   this.symbol,
            "folderId": this.folderId,
            "mode":     this._$mode
        };
    }
}