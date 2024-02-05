import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { ExternalItem } from "./ExternalItem";
import { Folder } from "@/core/domain/model/Folder";

/**
 * @extends {ExternalItem}
 * @class
 * @public
 */
export class ExternalFolder extends ExternalItem
{
    /**
     * @param {WorkSpace} work_space
     * @param {Folder} folder
     * @constructor
     * @public
     */
    constructor (
        work_space: WorkSpace,
        folder: Folder
    ) {

        super(work_space);

        // フォルダクラスを生成
        this._$instance = folder;
    }

    /**
     * @description ライブラリからの削除処理
     *              Deletion process from the library
     *
     * @return {void}
     * @method
     * @public
     */
    remove (): void
    {
        // TODO
    }
}