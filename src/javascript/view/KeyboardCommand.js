/**
 * @class
 */
class KeyboardCommand
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @description 自動セーブの判定フラグ
         * @type {boolean}
         * @default false
         * @private
         */
        this._$saved = false;

        /**
         * @type {function}
         * @default null
         * @private
         */
        this._$handler = null;

        // DOMの読込がまだであれば、イベントに登録
        Util.$readEnd++;
        if (document.readyState === "loading") {
            this._$handler = this.initialize.bind(this);
            window.addEventListener("DOMContentLoaded", this._$handler);
        } else {
            this.initialize();
        }
    }

    /**
     * @description 共通初期イベント登録関数
     *
     * @return {void}
     * @method
     * @public
     */
    initialize ()
    {
        // イベントの登録を解除して、変数を解放
        if (this._$handler) {
            window.removeEventListener("DOMContentLoaded", this._$handler);
            this._$handler = null;
        }

        // キーボードイベントを登録
        window.addEventListener("keydown", this.execute);

        Util.$initializeEnd();
    }

    /**
     * @param {KeyboardEvent} event
     *
     * @return {boolean}
     * @method
     * @public
     */
    execute (event)
    {
        if (Util.$keyLock || Util.$activeScript) {
            return false;
        }

        if (Util.$shiftKey) {
            event.preventDefault();
            return false;
        }

        switch (event.code) {

            case "Semicolon":
                if (event.ctrlKey && !event.metaKey
                    || !event.ctrlKey && event.metaKey
                ) {
                    event.preventDefault();

                    Util
                        .$currentWorkSpace()
                        .scene
                        .addLayer();

                    return false;
                }
                break;

            case "Minus":
                if (event.ctrlKey && !event.metaKey
                    || !event.ctrlKey && event.metaKey
                ) {
                    event.preventDefault();
                    this.removeLayer();
                    return false;
                }
                break;

            case "KeyC": // copy

                if (!Util.$canCopyLayer || !this._$targetLayer) {
                    return false;
                }

                if (event.ctrlKey && !event.metaKey
                    || !event.ctrlKey && event.metaKey
                ) {
                    Util.$copyLibrary   = null;
                    Util.$copyLayer     = null;
                    Util.$copyCharacter = null;
                    if (!Util.$keyLock && !Util.$activeScript) {

                        event.preventDefault();

                        Util.$copyWorkSpaceId = Util.$activeWorkSpaceId;

                        const layerId = this._$targetLayer.dataset.layerId | 0;
                        Util.$copyLayer = Util
                            .$currentWorkSpace()
                            .scene
                            .getLayer(layerId);

                        const element = document.getElementById("detail-modal");
                        element.textContent = "copy";
                        element.style.left  = `${this._$targetLayer.offsetLeft + 5}px`;
                        element.style.top   = `${this._$targetLayer.offsetTop  + 5}px`;
                        element.setAttribute("class", "fadeIn");

                        element.dataset.timerId = setTimeout(function ()
                        {
                            if (!this.classList.contains("fadeOut")) {
                                this.setAttribute("class", "fadeOut");
                            }
                        }.bind(element), 1500);

                        return false;
                    }
                }
                break;

            case "KeyV": // paste
                if (event.ctrlKey && !event.metaKey // windows
                    || !event.ctrlKey && event.metaKey // mac
                ) {

                    if (!Util.$keyLock && !Util.$activeScript && Util.$copyLayer) {

                        event.preventDefault();

                        const frame = Util.$timelineFrame.currentFrame;

                        const workSpace = Util.$currentWorkSpace();

                        const scene = workSpace.scene;
                        if (Util.$copyWorkSpaceId === Util.$activeWorkSpaceId) {

                            const object = Util.$copyLayer.toObject();
                            for (let idx = 0; idx < object.characters.length; ++idx) {
                                const character = object.characters[idx];
                                character.id    = workSpace._$characterId++;
                            }

                            scene.addLayer(new Layer(object));

                        } else {

                            const targetWorkSpace = Util.$workSpaces[Util.$copyWorkSpaceId];

                            const dup    = new Map();
                            const object = Util.$copyLayer.toObject();
                            for (let idx = 0; idx < object.characters.length; ++idx) {

                                const character = object.characters[idx];
                                character.id    = workSpace._$characterId++;

                                const instance = targetWorkSpace
                                    .getLibrary(character.libraryId)
                                    .toObject();

                                if (instance.type === "container") {

                                    Util.$copyContainer(instance, dup);

                                } else {

                                    if (!dup.has(character.libraryId)) {
                                        dup.set(character.libraryId, workSpace.nextLibraryId);
                                        instance.id = dup.get(character.libraryId);
                                        targetWorkSpace.addLibrary(instance);
                                    }

                                }

                                character.libraryId = dup.get(character.libraryId);
                            }

                            scene.addLayer(new Layer(object));
                            workSpace.initializeLibrary();
                        }

                        Util.$copyWorkSpaceId = -1;
                        Util.$copyLayer       = null;

                        scene.changeFrame(frame);

                        return false;
                    }
                }
                break;

            default:
                break;

        }
    }
}

Util.$keyboardCommand = new KeyboardCommand();
