import type { IObject } from "@/interface/IObject";
import type { IFolderSaveObject } from "@/interface/IFolderSaveObject";
import type { IFolderType } from "@/interface/IFolderType";
import type { WorkSpace } from "./WorkSpace";
import { Instance } from "./Instance";
import { execute as externalFolderCheckDuplicateService } from "@/external/core/application/ExternalFolder/service/ExternalFolderCheckDuplicateService";

/**
 * @extends {Instance}
 * @class
 * @public
 */
export class Folder extends Instance
{
    /**
     * @description フォルダの開閉状態の値を返す
     *              Returns the value of the folder's open/closed status
     *
     * @default "close"
     * @member {string}
     * @public
     */
    public mode: IFolderType;

    /**
     * @param {object} object
     * @constructor
     * @public
     */
    constructor (object: IObject<IFolderSaveObject>)
    {
        super(object);
        this.mode = object.mode || "close";
    }

    /**
     * @description ライブラリエリアの移動する先のフォルダーが自分の親フォルダーかチェック
     *              Check if the destination folder in the library area is your parent folder
     *
     * @param  {WorkSpace} work_space
     * @param  {number} parent_folder_id
     * @return {boolean}
     * @method
     * @public
     */
    checkDuplicate (work_space: WorkSpace, parent_folder_id: number): boolean
    {
        return externalFolderCheckDuplicateService(work_space, this, parent_folder_id);
    }

    /**
     * @description クラス内の変数をObjectにして返す
     *              Return variables in a class as Objects
     *
     * @return {object}
     * @method
     * @public
     */
    toObject (): IFolderSaveObject
    {
        return {
            "id":       this.id,
            "name":     this.name,
            "type":     this.type,
            "symbol":   this.symbol,
            "folderId": this.folderId,
            "mode":     this.mode
        };
    }
}