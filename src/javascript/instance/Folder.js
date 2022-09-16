/**
 * @class
 * @extends {Instance}
 */
class Folder extends Instance
{
    /**
     * @param {object} object
     * @constructor
     */
    constructor (object)
    {
        super(object);

        this._$mode = "clone";
        if (object.mode) {
            this._$mode = object.mode;
        }
    }

    /**
     * @description Folderクラスを複製
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
     * @return {string}
     * @public
     */
    get mode ()
    {
        return this._$mode;
    }

    /**
     * @param  {string} mode
     * @return {void}
     * @public
     */
    set mode (mode)
    {
        this._$mode = mode;
    }

    /**
     * @description フォルダーの中身の削除処理
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
     * @description セーブデータに変換
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
     * @description フォルダ内のアイテムIDを配列に格納
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
