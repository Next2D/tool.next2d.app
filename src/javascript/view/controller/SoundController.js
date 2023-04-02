/**
 * @class
 * @extends {BaseController}
 * @memberOf view.controller
 */
class SoundController extends BaseController
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super("sound");
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get MIN_VOLUME ()
    {
        return 0;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get MAX_VOLUME ()
    {
        return 100;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get MIN_LOOP_COUNT ()
    {
        return 0;
    }

    /**
     * @return {number}
     * @const
     * @static
     */
    static get MAX_LOOP_COUNT ()
    {
        return 0xffff;
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

        const element = document
            .getElementById("sound-add");

        if (element) {
            element
                .addEventListener("mousedown", () =>
                {
                    const element = document.getElementById("sound-select");
                    if (element && element.options.length) {
                        // undo用にセーブ
                        this.save();

                        // DOM追加
                        this.addSound();

                        // saveフラグを初期化
                        this._$saved = false;
                    }
                });
        }
    }

    /**
     * @description タイムラインにサウンドを追加
     *              タイムラインでフレームを指定した際に引数がセットされる
     *
     * @param  {object} [object=null]
     * @param  {number} [id=0]
     * @return {void}
     * @method
     * @public
     */
    addSound (object = null, id = 0)
    {
        const workSpace = Util.$currentWorkSpace();
        if (!object) {

            const element = document.getElementById("sound-select");

            const frame = Util.$timelineFrame.currentFrame;
            const scene = workSpace.scene;
            if (!scene._$sounds.has(frame)) {
                scene._$sounds.set(frame, []);
            }

            const sounds = scene._$sounds.get(frame);
            id = sounds.length;

            object = {
                "characterId": element.value | 0,
                "volume":      100,
                "loopCount":   0,
                "autoPlay":    false
            };

            sounds.push(object);

            // アイコンをセット
            this.setIcon(frame);
        }

        const instance = workSpace.getLibrary(object.characterId);

        const htmlTag = `
<div id="sound-id-${id}" class="sound-border">
    <div class="sound-title">
      <span id="sound-name-${id}" data-sound-id="${id}">${instance.name}</span>
      <i class="trash" id="sound-trash-${id}" data-sound-id="${id}" data-detail="{{サウンドを削除}}"></i>
    </div>

    <div class="sound-container">
        <div class="sound-setting-container">
            <div class="sound-text">Volume</div>
            <div><input type="text" id="sound-volume-${id}" data-sound-id="${id}" data-name="volume" value="100" data-detail="{{音量設定}}" autocomplete="off" tabindex="-1"></div>
        
            <div class="sound-text">Loop<br>Count</div>
            <div><input type="text" id="sound-loop-count-${id}" data-sound-id="${id}" data-name="loop-count" value="0" data-detail="{{ループ回数}}" autocomplete="off" tabindex="-1"></div>
        </div>
    </div>
</div>
`;
        if (instance) {

            instance
                .getScenePreview()
                .then((element) =>
                {
                    const soundElement = document
                        .getElementById(`sound-id-${id}`);

                    if (!soundElement) {
                        return ;
                    }

                    const parent = soundElement
                        .getElementsByClassName("sound-container")[0];

                    const div = document.createElement("div");
                    div.setAttribute("class", "sound-setting-preview-container");

                    element.volume = object.volume / 100;
                    element.setAttribute("id", `sound-preview-${id}`);
                    div.appendChild(element);

                    parent.appendChild(div);

                    if (!Util.$audioContext) {
                        Util.$audioContext = new window.AudioContext();
                    }

                    Util
                        .$soundWaveform
                        .draw(instance._$buffer.slice())
                        .then((canvas) =>
                        {
                            const div = document.createElement("div");
                            div.setAttribute("class", "sound-setting-preview-container");
                            div.appendChild(canvas);

                            parent.appendChild(div);
                        });
                });
        }

        document
            .getElementById("sound-list-area")
            .insertAdjacentHTML("beforeend", htmlTag);

        const soundVolume = document
            .getElementById(`sound-volume-${id}`);
        soundVolume.value = `${object.volume}`;
        this.setInputEvent(soundVolume);

        const soundLoopCount = document
            .getElementById(`sound-loop-count-${id}`);
        soundLoopCount.value = `${object.loopCount}`;
        this.setInputEvent(soundLoopCount);

        document
            .getElementById(`sound-trash-${id}`)
            .addEventListener("click", (event) =>
            {
                // undo用にセーブ
                this.save();

                this.trash(
                    event.target.dataset.soundId | 0
                );

                // 再描画
                this.createSoundElements();

                // saveフラグを初期化
                this._$saved = false;
            });

        Util.$addModalEvent(
            document.getElementById(`sound-id-${id}`)
        );
    }

    /**
     * @description ボリュームをコントロール
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeSoundVolume (value)
    {
        value = Util.$clamp(
            value | 0,
            SoundController.MIN_VOLUME,
            SoundController.MAX_VOLUME
        );

        this.updateSoundProperty("volume", value);

        return value;
    }

    /**
     * @description ボリュームをコントロール
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeSoundLoopCount (value)
    {
        value = Util.$clamp(
            value | 0,
            SoundController.MIN_LOOP_COUNT,
            SoundController.MAX_LOOP_COUNT
        );

        this.updateSoundProperty("loopCount", value);

        return value;
    }

    /**
     * @description 指定したサウンドの値を更新
     *
     * @param {string} name
     * @param {*} value
     * @method
     * @public
     */
    updateSoundProperty (name, value)
    {
        if (!this._$currentTarget) {
            return ;
        }

        value |= 0;

        const frame = Util.$timelineFrame.currentFrame;

        const scene  = Util.$currentWorkSpace().scene;
        const index  = this._$currentTarget.dataset.soundId | 0;
        const object = scene._$sounds.get(frame)[index];
        object[name] = value;

        if (name === "volume") {
            document
                .getElementById(`sound-preview-${index}`)
                .volume = value / 100;
        }
    }

    /**
     * @description タイムラインのヘッダーに音符アイコンを追加
     *
     * @param  {number} frame
     * @return {void}
     * @method
     * @public
     */
    setIcon (frame)
    {
        const leftFrame = Util.$timelineHeader.leftFrame;
        if (leftFrame > frame) {
            return ;
        }

        const index  = frame - leftFrame;
        const parent = document
            .getElementById("timeline-header")
            .children[index];

        const element = parent.children[TimelineHeader.SOUND_INDEX];
        // const element = document
        //     .getElementById(`frame-label-sound-${frame}`);

        if (!element.classList.contains("frame-border-box-sound")) {
            element
                .setAttribute("class", "frame-border-box-sound");
        }
    }

    /**
     * @description タイムラインヘッダーの音符アイコンを削除
     *
     * @param  {number} frame
     * @return {void}
     * @method
     * @public
     */
    deleteIcon (frame)
    {
        const element = document
            .getElementById("timeline-header");

        if (!element) {
            return ;
        }

        const nodes = element
            .getElementsByClassName("frame-border-box-sound");

        for (let idx = 0; idx < nodes.length; ++idx) {

            const node = nodes[idx];

            const targetFrame = node.dataset.frame | 0;
            if (targetFrame !== frame) {
                continue;
            }

            node.setAttribute("class", "frame-border-box");
            break;
        }

    }

    /**
     * @description 指定のサウンドを削除
     *
     * @param {number} index
     * @method
     * @public
     */
    trash (index)
    {
        const frame = Util.$timelineFrame.currentFrame;

        const scene  = Util.$currentWorkSpace().scene;
        const sounds = scene._$sounds.get(frame);
        sounds.splice(index, 1);

        if (!sounds.length) {

            scene._$sounds.delete(frame);

            // 音符アイコンを削除
            this.deleteIcon(frame);
        }
    }

    /**
     * @description 設定を初期化
     *
     * @return {void}
     * @method
     * @public
     */
    clear ()
    {
        const element = document
            .getElementById("sound-list-area");

        if (element) {
            while (element.children.length) {
                element.children[0].remove();
            }
        }
    }

    /**
     * @description 指定のシーンとフレームからサウンド設定を反映
     *
     * @return {void}
     * @method
     * @public
     */
    createSoundElements ()
    {
        // 初期化
        this.clear();

        // 再生中は表示をしない
        if (!Util.$timelinePlayer.stopFlag) {
            return ;
        }

        const frame = Util.$timelineFrame.currentFrame;

        const scene = Util.$currentWorkSpace().scene;
        if (scene.hasSound(frame)) {

            const sounds = scene.getSound(frame);
            for (let idx = 0; idx < sounds.length; ++idx) {
                this.addSound(sounds[idx], idx);
            }

        }
    }
}

Util.$soundController = new SoundController();

