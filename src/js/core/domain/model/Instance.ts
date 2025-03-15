import type { IInstanceType } from "@/interface/IInstanceType";
import type { IObject } from "@/interface/IObject";
import type { IBounds } from "@/interface/IBounds";
import type { WorkSpace } from "./WorkSpace";
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
    /**
     * @description インスタンスのユニークIDを返却
     *              Return the unique ID of the instance
     *
     * @returns {number}
     * @readonly
     * @public
     */
    public readonly id: number;

    /**
     * @description インスタンスタイプ
     *              instance type
     *
     * @returns {string}
     * @readonly
     * @public
     */
    public readonly type: IInstanceType;

    /**
     * @description ライブラリ一覧に表示されるインスタンス名
     *              Instance name as it appears in the library list
     *
     * @member {string}
     * @public
     */
    public name: string;

    /**
     * @description ライブラリ一覧で設定したシンボル名
     *              Symbol name set in the library list
     *
     * @member {string}
     * @public
     */
    public symbol: string;

    /**
     * @description 親フォルダのID
     *              ID of parent folder
     *
     * @member {number}
     * @public
     */
    public folderId: number;

    /**
     * @param {object} object
     * @constructor
     * @public
     */
    constructor (object: IObject<any>)
    {
        this.id       = object.id;
        this.type     = object.type;
        this.name     = object.name || "";
        this.symbol   = object.symbol || "";
        this.folderId = object.folderId || 0;
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
     * @description インスタンスのHTML要素を返却(親クラスなので、nullを返却)
     *              Returns the HTML element of the instance (since it is a parent class, it returns null)
     *
     * @returns {HTMLElement | null}
     * @method
     * @public
     */
    async getHTMLElement (): Promise<HTMLElement | null>
    {
        return null;
    }

    /**
     * @description インスタンスのプロパティを返却(親クラスなので、空のオブジェクトを返却)
     *              Returns the properties of the instance (since it is a parent class, it returns an empty object)
     *
     * @returns {IObject<any>}
     * @method
     * @public
     */
    toObject (): IObject<any>
    {
        return {};
    }

    /**
     * @description インスタンスのバウンディングボックスを返却(親クラスなので、nullを返却)
     *              Returns the bounding box of the instance (since it is a parent class, it returns null)
     *
     * @returns {IBounds | null}
     * @method
     * @public
     */
    getRawBounds (): IBounds | null
    {
        return null;
    }

    /**
     * @description インスタンスのプロパティを返却(親クラスなので、空のオブジェクトを返却)
     *              Returns the properties of the instance (since it is a parent class, it returns an empty object)
     *
     * @returns {IObject<any>}
     * @method
     * @public
     */
    toPublish (): IObject<any>
    {
        return {};
    }

    /**
     * @description ライブラリからの削除時の処理関数
     *              Processing functions for deletion from the library
     *
     * @return {void}
     * @method
     * @public
     */
    remove (): void
    {
        // TODO ライブラリからの削除時の処理
    }
}