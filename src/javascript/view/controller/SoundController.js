/**
 * @class
 * @extends {BaseController}
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
        if (!object) {

            const element = document.getElementById("sound-select");
            const option  = element.options[element.selectedIndex];

            const frame = Util.$timelineFrame.currentFrame;

            const scene = Util.$currentWorkSpace().scene;
            if (!scene._$sounds.has(frame)) {
                scene._$sounds.set(frame, []);
            }

            const sounds = scene._$sounds.get(frame);
            id = sounds.length;

            object = {
                "characterId": element.value | 0,
                "name":        option.textContent,
                "volume":      100,
                "autoPlay":    false
            };

            sounds.push(object);

            const iconElement = document
                .getElementById(`frame-label-sound-${frame}`);

            if (!iconElement.classList.contains("frame-border-box-sound")) {
                iconElement
                    .setAttribute("class", "frame-border-box-sound");
            }
        }

        const htmlTag = `
<div id="sound-id-${id}" class="sound-border">
    <div class="sound-title">
      <span id="sound-name-${id}" data-sound-id="${id}">${object.name}</span>
      <i class="trash" id="sound-trash-${id}" data-sound-id="${id}" data-detail="{{サウンドを削除}}"></i>
    </div>

    <div class="sound-container">
        <div class="sound-setting-container">
            <div class="sound-text">Volume</div>
            <div><input type="text" id="sound-volume-${id}" data-sound-id="${id}" data-name="volume" value="100" data-detail="{{音量設定}}"></div>
        
            <div class="sound-text">Loop</div>
            <select id="sound-loop-select-${id}" data-sound-id="${id}" data-detail="{{ループ}}">
                <option value="0">Off</option>
                <option value="1">On</option>
            </select>
        </div>
    </div>
</div>
`;
        document
            .getElementById("sound-list-area")
            .insertAdjacentHTML("beforeend", htmlTag);

        const soundVolume = document.getElementById(`sound-volume-${id}`);
        soundVolume.value = `${object.volume}`;
        this.setInputEvent(soundVolume);

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

        const loop = document
            .getElementById(`sound-loop-select-${id}`);

        loop.addEventListener("change", (event) =>
        {
            // undo用にセーブ
            this.save();

            this._$currentTarget = event.target;
            this.executeFunction(
                event.target.id,
                event.target.value
            );

            // フラグを初期化
            this._$saved         = false;
            this._$currentTarget = null;
        });
        loop.children[object.loop ? 1 : 0].selected = true;

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
     * @description ループ設定
     *
     * @param  {string} value
     * @return {number}
     * @method
     * @public
     */
    changeSoundLoopSelect (value)
    {
        this.updateSoundProperty("loop", !!(value | 0));
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

        const frame = Util.$timelineFrame.currentFrame;

        const scene  = Util.$currentWorkSpace().scene;
        const index  = this._$currentTarget.dataset.soundId | 0;
        const object = scene._$sounds.get(frame)[index];
        object[name] = value;
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

            document
                .getElementById(`frame-label-sound-${frame}`)
                .classList
                .add("frame-border-box");

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
        const element = document
            .getElementById("sound-list-area");

        if (element) {
            while (element.children.length) {
                element.children[0].remove();
            }
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

