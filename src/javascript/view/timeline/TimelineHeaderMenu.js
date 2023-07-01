/**
 * @class
 * @extends {BaseTimeline}
 * @memberOf view.timeline
 */
class TimelineHeaderMenu extends BaseTimeline
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        /**
         * @type {number}
         * @default -1
         * @private
         */
        this._$copyWorkSpaceId = -1;

        /**
         * @type {Map}
         * @private
         */
        this._$copyScript = new Map();

        /**
         * @type {Map}
         * @private
         */
        this._$copyLabel = new Map();

        /**
         * @type {Map}
         * @private
         */
        this._$copySound = new Map();
    }

    /**
     * @description 初期起動関数
     *
     * @return {void}
     * @method
     * @public
     */
    initialize ()
    {
        super.initialize();

        const elementIds = [
            "context-menu-script-add-one",
            "context-menu-script-copy-all",
            "context-menu-script-copy",
            "context-menu-script-paste",
            "context-menu-label-copy-all",
            "context-menu-label-copy",
            "context-menu-label-paste",
            "context-menu-sound-copy-all",
            "context-menu-sound-copy",
            "context-menu-sound-paste"
        ];

        for (let idx = 0; idx < elementIds.length; ++idx) {

            const element = document
                .getElementById(elementIds[idx]);

            if (!element) {
                continue;
            }

            // eslint-disable-next-line no-loop-func
            element.addEventListener("mousedown", (event) =>
            {
                // 親のイベント中止
                event.stopPropagation();

                // メニューを非表示
                Util.$endMenu();

                // id名で関数を実行
                this.executeFunction(event);
            });
        }
    }

    /**
     * @description ヘッダーのメニューを表示
     *
     * @param  {MouseEvent} event
     * @return {void}
     * @method
     * @public
     */
    show (event)
    {
        const elementIds = [
            "context-menu-script-copy-all",
            "context-menu-script-copy",
            "context-menu-script-paste",
            "context-menu-label-copy-all",
            "context-menu-label-copy",
            "context-menu-label-paste",
            "context-menu-sound-copy-all",
            "context-menu-sound-copy",
            "context-menu-sound-paste"
        ];

        // 一度、非表示にする
        for (let idx = 0; idx < elementIds.length; ++idx) {

            const element = document
                .getElementById(elementIds[idx]);

            if (!element) {
                continue;
            }

            element
                .setAttribute("style", "opacity:0.5; pointer-events:none;");
        }

        const scene = Util.$currentWorkSpace().scene;
        const frame = Util.$timelineFrame.currentFrame;

        if (scene._$actions.size) {

            const element = document
                .getElementById("context-menu-script-copy-all");

            if (element) {
                element.setAttribute("style", "");
            }

            if (scene._$actions.has(frame)) {
                const element = document
                    .getElementById("context-menu-script-copy");

                if (element) {
                    element.setAttribute("style", "");
                }
            }
        }

        if (scene._$labels.size) {

            const element = document
                .getElementById("context-menu-label-copy-all");

            if (element) {
                element.setAttribute("style", "");
            }

            if (scene._$labels.has(frame)) {
                const element = document
                    .getElementById("context-menu-label-copy");

                if (element) {
                    element.setAttribute("style", "");
                }
            }
        }

        if (scene._$sounds.size) {

            const element = document
                .getElementById("context-menu-sound-copy-all");

            if (element) {
                element.setAttribute("style", "");
            }

            if (scene._$sounds.has(frame)) {
                const element = document
                    .getElementById("context-menu-sound-copy");

                if (element) {
                    element.setAttribute("style", "");
                }
            }
        }

        if (this._$copyScript.size) {
            const element = document
                .getElementById("context-menu-script-paste");

            if (element) {
                element.setAttribute("style", "");
            }
        }

        if (this._$copyLabel.size) {
            const element = document
                .getElementById("context-menu-label-paste");

            if (element) {
                element.setAttribute("style", "");
            }
        }

        if (this._$copySound.size) {
            const element = document
                .getElementById("context-menu-sound-paste");

            if (element) {
                element.setAttribute("style", "");
            }
        }

        Util.$endMenu("timeline-header-menu");

        const element = document
            .getElementById("timeline-header-menu");

        element.style.left = `${event.pageX + 5}px`;
        element.style.top  = `${event.pageY - element.clientHeight}px`;
        if (15 > element.offsetTop) {
            element.style.top = "10px";
        }

        if (event.pageY + 15 > window.innerHeight) {
            element.style.top = `${event.pageY - element.clientHeight - 15}px`;
        }

        element.setAttribute("class", "fadeIn");
    }

    /**
     * @description 指定したフレームのスクリプトを起動
     *
     * @return {void}
     * @method
     * @public
     */
    executeContextMenuScriptAddOne ()
    {
        Util.$javaScriptEditor.show();
    }

    /**
     * @description シーン内のスクリプトを全てコピー
     *
     * @return {void}
     * @method
     * @public
     */
    executeContextMenuScriptCopyAll ()
    {
        const scene = Util.$currentWorkSpace().scene;
        this._$copyScript.clear();

        const frames = Array.from(scene._$actions.keys());
        frames.sort((a, b) =>
        {
            return a - b;
        });

        for (let idx = 0; idx < frames.length; ++idx) {
            const frame = frames[idx];
            this._$copyScript.set(
                frame,
                scene._$actions.get(frame)
            );
        }
    }

    /**
     * @description 指定したフレームのスクリプトをコピー
     *
     * @return {void}
     * @method
     * @public
     */
    executeContextMenuScriptCopy ()
    {
        const scene = Util.$currentWorkSpace().scene;
        this._$copyScript.clear();

        const frame = Util.$timelineFrame.currentFrame;
        this._$copyScript.set(frame, scene._$actions.get(frame));
    }

    /**
     * @description コピー中のスクリプトを指定したフレームにペースト
     *
     * @return {void}
     * @method
     * @public
     */
    executeContextMenuScriptPaste ()
    {
        Util
            .$currentWorkSpace()
            .temporarilySaved();

        const scene = Util.$currentWorkSpace().scene;
        const frame = Util.$timelineFrame.currentFrame;

        const subFrame = this._$copyScript.keys().next().value - frame;
        for (const [frame, script] of this._$copyScript) {
            scene._$actions.set(frame - subFrame, script);
        }

        Util.$timelineHeader.rebuild();

        Util
            .$javascriptController
            .reload();
    }

    /**
     * @description シーン内のラベルを全てコピー
     *
     * @return {void}
     * @method
     * @public
     */
    executeContextMenuLabelCopyAll ()
    {
        const scene = Util.$currentWorkSpace().scene;
        this._$copyLabel.clear();

        const frames = Array.from(scene._$labels.keys());
        frames.sort((a, b) =>
        {
            return a - b;
        });

        for (let idx = 0; idx < frames.length; ++idx) {
            const frame = frames[idx];
            this._$copyLabel.set(
                frame,
                scene._$labels.get(frame)
            );
        }
    }

    /**
     * @description 指定したフレームのラベルをコピー
     *
     * @return {void}
     * @method
     * @public
     */
    executeContextMenuLabelCopy ()
    {
        const scene = Util.$currentWorkSpace().scene;
        this._$copyLabel.clear();

        const frame = Util.$timelineFrame.currentFrame;
        this._$copyLabel.set(frame, scene._$labels.get(frame));
    }

    /**
     * @description コピー中のラベルを指定したフレームにペースト
     *
     * @return {void}
     * @method
     * @public
     */
    executeContextMenuLabelPaste ()
    {
        Util
            .$currentWorkSpace()
            .temporarilySaved();

        const scene = Util.$currentWorkSpace().scene;
        const frame = Util.$timelineFrame.currentFrame;

        const subFrame = this._$copyLabel.keys().next().value - frame;
        for (const [frame, name] of this._$copyLabel) {
            scene._$labels.set(frame - subFrame, name);
        }

        Util.$timelineHeader.rebuild();
    }

    /**
     * @description シーン内のサウンドを全てコピー
     *
     * @return {void}
     * @method
     * @public
     */
    executeContextMenuSoundCopyAll ()
    {
        this._$copyWorkSpaceId = Util.$activeWorkSpaceId;

        const scene = Util.$currentWorkSpace().scene;
        this._$copySound.clear();

        const frames = Array.from(scene._$sounds.keys());
        frames.sort((a, b) =>
        {
            return a - b;
        });

        for (let idx = 0; idx < frames.length; ++idx) {

            const frame  = frames[idx];
            const sounds = scene._$sounds.get(frame);

            const copySounds = [];
            for (let idx = 0; idx < sounds.length; ++idx) {
                copySounds.push(Object.assign({}, sounds[idx]));
            }
            this._$copySound.set(frame, copySounds);
        }
    }

    /**
     * @description 指定したフレームのサウンドをコピー
     *
     * @return {void}
     * @method
     * @public
     */
    executeContextMenuSoundCopy ()
    {
        this._$copyWorkSpaceId = Util.$activeWorkSpaceId;

        const scene = Util.$currentWorkSpace().scene;
        this._$copySound.clear();

        const frame  = Util.$timelineFrame.currentFrame;
        const sounds = scene._$sounds.get(frame);

        const copySounds = [];
        for (let idx = 0; idx < sounds.length; ++idx) {
            copySounds.push(Object.assign({}, sounds[idx]));
        }

        this._$copySound.set(frame, copySounds);
    }

    /**
     * @description コピー中のサウンドを指定したフレームにペースト
     *
     * @return {void}
     * @method
     * @public
     */
    executeContextMenuSoundPaste ()
    {
        const scene = Util.$currentWorkSpace().scene;
        const frame = Util.$timelineFrame.currentFrame;

        const subFrame = this._$copySound.keys().next().value - frame;

        if (this._$copyWorkSpaceId === Util.$activeWorkSpaceId) {

            Util
                .$currentWorkSpace()
                .temporarilySaved();

            for (const [frame, sounds] of this._$copySound) {
                scene._$sounds.set(frame - subFrame, sounds);
            }

        } else {

            const fromWorkSpace = Util.$workSpaces[this._$copyWorkSpaceId];
            const toWorkSpace   = Util.$currentWorkSpace();

            Util.$confirmModal.clear();

            const soundInstances = new Map();
            for (const sounds of this._$copySound.values()) {

                for (let idx = 0; idx < sounds.length; ++idx) {

                    const instance = fromWorkSpace
                        .getLibrary(sounds[idx].characterId);

                    if (!instance || soundInstances.has(instance.id)) {
                        continue;
                    }

                    soundInstances.set(instance.id, instance);
                }

            }

            if (!soundInstances.size) {
                return ;
            }

            Util
                .$currentWorkSpace()
                .temporarilySaved();

            const soundIds = new Map();
            for (const instance of soundInstances.values()) {

                const path = instance
                    .getPathWithWorkSpace(fromWorkSpace);

                if (toWorkSpace._$nameMap.has(path)) {
                    Util.$confirmModal.files.push({
                        "file": instance,
                        "path": path,
                        "workSpaceId": this._$copyWorkSpaceId,
                        "type": "copy"
                    });
                    continue;
                }

                const clone = instance.clone();
                clone._$id = toWorkSpace.nextLibraryId;

                soundIds.set(instance.id, clone.id);

                // Elementを追加
                Util
                    .$libraryController
                    .createInstance(
                        clone.type,
                        clone.name,
                        clone.id,
                        clone.symbol
                    );

                // 内部データに追加
                toWorkSpace._$libraries.set(clone.id, clone);

                // フォルダ内にあればフォルダを生成
                if (clone.folderId) {
                    Util
                        .$confirmModal
                        .createFolder(
                            this._$copyWorkSpaceId, clone
                        );
                }
            }

            for (const [frame, sounds] of this._$copySound) {

                const copySounds = [];
                for (let idx = 0; idx < sounds.length; ++idx) {

                    const sound = sounds[idx];

                    if (!soundIds.has(sound.characterId)) {
                        continue;
                    }

                    const object = Object.assign({}, sound);
                    object.characterId = soundIds.get(sound.characterId);

                    copySounds.push(object);
                }

                if (copySounds.length) {
                    scene._$sounds.set(frame - subFrame, copySounds);
                }
            }

            if (Util.$confirmModal.files.length) {
                Util.$confirmModal.show();
            } else {
                Util.$confirmModal.clear();
            }
        }

        Util.$timelineHeader.rebuild();
        Util.$soundController.createSoundElements();
    }
}

Util.$timelineHeaderMenu  = new TimelineHeaderMenu();