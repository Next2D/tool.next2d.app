/**
 * ライブラリ内のフォルダ階層管理クラス
 * Folder hierarchy management class in the library
 *
 * @class
 * @extends {Instance}
 * @memberOf instance
 */
class Folder extends Instance
{
    /**
     * @param {object} object
     * @constructor
     * @public
     */
    constructor (object)
    {
        super(object);

        /**
         * @type {string}
         * @default FolderType.CLOSE
         * @private
         */
        this._$mode = FolderType.CLOSE;

        if (object.mode) {
            this._$mode = object.mode;
        }
    }

    /**
     * @description Folderクラスを複製
     *              Duplicate Folder class
     *
     * @return {Folder}
     * @method
     * @public
     */
    clone ()
    {
        return new Folder(JSON.parse(JSON.stringify(this.toObject())));
    }

    /**
     * @description 開閉状態の値を返す
     *              Returns the value of the open/closed state
     *
     * @default "close"
     * @member {string}
     * @public
     */
    get mode ()
    {
        return this._$mode;
    }
    set mode (mode)
    {
        this._$mode = FolderType.OPEN === `${mode}`.toLowerCase()
            ? FolderType.OPEN
            : FolderType.CLOSE;
    }

    /**
     * @description フォルダーの中身の削除処理
     *              Deletion process of folder contents
     *
     * @return {void}
     * @method
     * @public
     */
    remove ()
    {
        const workSpace = Util.$currentWorkSpace();
        for (let instance of workSpace._$libraries.values()) {

            // フォルダの中にないか、IDが一致ない時はスキップ
            if (!instance.folderId || instance.folderId !== this.id) {
                continue;
            }

            instance.remove();

            // 内部データからも削除
            workSpace.removeLibrary(instance.id);
        }
    }

    /**
     * @description クラス内の変数をObjectにして返す
     *              Return variables in a class as Objects
     *
     * @return {object}
     * @method
     * @public
     */
    toObject ()
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

    /**
     * @description フォルダ内のアイテムIDを変数の配列に格納
     *              Stores the item IDs in the folder in an array of variables
     *
     * @return {void}
     * @method
     * @public
     */
    getInstanceIds (instance_ids)
    {
        const workSpace = Util.$currentWorkSpace();
        for (const instance of workSpace._$libraries.values()) {

            if (!instance.folderId || instance.folderId !== this.id) {
                continue;
            }

            if (instance.type === InstanceType.FOLDER) {
                instance.getInstanceIds(instance_ids);
                continue;
            }

            instance_ids.push(instance.id);
        }
    }
}
