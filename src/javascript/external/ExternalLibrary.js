/**
 * @class
 * @memberOf external
 */
class ExternalLibrary
{
    /**
     * @param {ExternalDocument} external_document
     * @constructor
     * @public
     */
    constructor (external_document)
    {
        /**
         * @type {ExternalDocument}
         * @private
         */
        this._$document = external_document;
    }

    /**
     * @param  {string} rename
     * @return {void}
     * @method
     * @public
     */
    renameItem (path, rename)
    {
        const item = this.getItem(path);
        if (!item) {
            return ;
        }

        item._$instance.name = rename;
        Util.$libraryController.reload();
    }

    /**
     * @param  {string} path
     * @return {void}
     * @method
     * @public
     */
    duplicateItem (path)
    {
        const item = this.getItem(path);
        if (!item) {
            return ;
        }

        Util.$libraryController.activeInstance = document
            .getElementById(`library-child-id-${item._$instance.id}`);

        Util.$libraryMenu.executeLibraryMenuCopy();
        Util.$libraryMenu.executeLibraryMenuPaste();
    }

    /**
     * @param  {string} path
     * @return {void}
     * @method
     * @public
     */
    selectItem (path)
    {
        const item = this.getItem(path);
        if (!item) {
            return ;
        }

        Util
            .$libraryController
            .activeInstance = document.getElementById(`library-child-id-${item._$instance.id}`);
    }

    /**
     * @param  {string} path
     * @return {Promise}
     * @method
     * @public
     */
    editItem (path)
    {
        const item = this.getItem(path);
        if (!item || item._$instance.type !== InstanceType.MOVIE_CLIP) {
            return Promise.resolve();
        }

        // シーン名をリストに追加
        Util
            .$currentWorkSpace()
            .root
            .addSceneName();

        return Util.$sceneChange.execute(item._$instance.id);
    }

    /**
     * @param  {string} type
     * @param  {string} path
     * @return {boolean}
     * @method
     * @public
     */
    addNewItem (type, path)
    {
        path = `${path}`;
        const workSpace = this._$document._$workSpace;

        const paths = path.split("/");
        const item  = this.getItem(paths.join("/"));
        if (!item) {
            let libraryTyle = "";
            switch (type) {

                case "movie clip":
                    libraryTyle = InstanceType.MOVIE_CLIP;
                    break;

                case "bitmap":
                    libraryTyle = InstanceType.BITMAP;
                    break;

                case "folder":
                    libraryTyle = InstanceType.FOLDER;
                    break;

                default:
                    break;

            }

            const name = paths.pop();
            const instance = workSpace.addLibrary({
                "id": Util.$currentWorkSpace().nextLibraryId,
                "type": libraryTyle,
                "name": name,
                "symbol": ""
            });

            if (paths.length) {
                const folderPath = paths.join("/");
                this.newFolder(folderPath);

                const folderItem = this.getItem(folderPath);
                instance.folderId = folderItem._$instance.id;
            }

            workSpace
                ._$nameMap
                .set(instance.path, instance.id);

            Util
                .$instanceSelectController
                .createInstanceSelect(instance);

            Util.$libraryController.reload();
        }

        return true;
    }

    /**
     * @param  {string} path
     * @return {ExternalItem[]|null}
     */
    getItem (path)
    {
        path = `${path}`;

        const workSpace = this._$document._$workSpace;
        for (let instance of workSpace._$libraries.values()) {

            if (instance.path !== path) {
                continue;
            }

            switch (instance.type) {

                case InstanceType.MOVIE_CLIP:
                    return new ExternalSymbolItem(
                        instance, this._$document
                    );

                case InstanceType.SOUND:
                    return new ExternalSoundItem(
                        instance, this._$document
                    );

                case InstanceType.BITMAP:
                    return new ExternalBitmapItem(
                        instance, this._$document
                    );

                case InstanceType.SHAPE:
                    if (instance.inBitmap) {
                        const bitmapObject = instance._$recodes[instance._$recodes.length - 4];

                        const bitmapInstance = workSpace.getLibrary(
                            bitmapObject._$instanceId
                        );

                        return new ExternalBitmapItem(
                            bitmapInstance, this._$document
                        );
                    }
                    return new ExternalItem(
                        instance, this._$document
                    );

                case InstanceType.FOLDER:
                    return new ExternalFolderItem(
                        instance, this._$document
                    );

                default:
                    return new ExternalItem(
                        instance, this._$document
                    );

            }

        }

        return null;
    }

    /**
     * @return {array}
     * @public
     */
    get items ()
    {
        const workSpace = this._$document._$workSpace;

        const items = [];
        for (const instance of workSpace._$libraries.values()) {

            switch (instance.type) {

                case InstanceType.MOVIE_CLIP:
                    items.push(new ExternalSymbolItem(instance, this._$document));
                    break;

                case InstanceType.SHAPE:
                    if (instance.inBitmap) {
                        items.push(new ExternalBitmapItem(instance, this._$document));
                    } else {
                        items.push(new ExternalItem(instance, this._$document));
                    }
                    break;

                case InstanceType.BITMAP:
                    items.push(new ExternalBitmapItem(instance, this._$document));
                    break;

                case InstanceType.SOUND:
                    items.push(new ExternalSoundItem(instance, this._$document));
                    break;

                default:
                    items.push(new ExternalItem(instance, this._$document));
                    break;

            }
        }

        // 最初はrootなので除外
        items.shift();

        return items;
    }

    /**
     * @param  {string} path
     * @return {number}
     * @method
     * @public
     */
    findItemIndex (path)
    {
        const workSpace = this._$document._$workSpace;

        let rootSkip = false;
        let index = 0;
        for (const instance of workSpace._$libraries.values()) {

            if (!rootSkip) {
                rootSkip = true;
                continue;
            }

            index++;

            if (instance.path !== path) {
                continue;
            }

            break;
        }

        return index - 1;
    }

    /**
     * @param  {string} path
     * @return {boolean}
     * @method
     * @public
     */
    itemExists (path)
    {
        path = `${path}`;

        const workSpace = this._$document._$workSpace;
        for (let instance of workSpace._$libraries.values()) {

            if (instance.path !== path) {
                continue;
            }

            return true;
        }

        return false;
    }

    /**
     * @param {string} path
     * @method
     * @public
     */
    newFolder (path)
    {
        const workSpace = this._$document._$workSpace;
        const paths = path.split("/");

        let folderPaths = [];
        let folderId = 0;
        for (let idx = 0; idx < paths.length; ++idx) {

            const name = paths[idx];

            folderPaths.push(name);

            const item = this.getItem(folderPaths.join("/"));
            if (item) {
                folderId = item._$instance.id;
                continue;
            }

            const instance = workSpace.addLibrary({
                "id": Util.$currentWorkSpace().nextLibraryId,
                "type": InstanceType.FOLDER,
                "name": name,
                "symbol": ""
            });

            instance.folderId = folderId;
            folderId = instance.id;
        }

        Util.$libraryController.reload();
    }

    /**
     * @param  {object} point
     * @param  {string} path
     * @return {Promise}
     * @method
     * @public
     */
    addItemToDocument (point, path, reload = true)
    {
        if (!point || !path) {
            return Promise.resolve(false);
        }

        path = `${path}`;

        const workSpace = this._$document._$workSpace;
        for (let instance of workSpace._$libraries.values()) {

            if (instance.path !== path) {
                continue;
            }

            // ライブラリを選択状態に
            Util
                .$libraryController
                .activeInstance = document.getElementById(
                    `library-child-id-${instance.id}`
                );

            return Util
                .$screen
                .drop({
                    "offsetX": point.x + Util.$offsetLeft,
                    "offsetY": point.y + Util.$offsetTop
                }, reload)
                .then(() =>
                {
                    return Promise.resolve(true);
                });
        }

        return Promise.resolve(false);
    }
}
