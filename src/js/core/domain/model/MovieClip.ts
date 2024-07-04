import type { SoundObjectImpl } from "@/interface/SoundObjectImpl";
import type { MovieClipSaveObjectImpl } from "@/interface/MovieClipSaveObjectImpl";
import type { ActionSaveObjectImpl } from "@/interface/ActionSaveObjectImpl";
import type { FrameObjectImpl } from "@/interface/FrameObjectImpl";
import type { SoundSaveListImpl } from "@/interface/SoundSaveListImpl";
import { Instance } from "./Instance";
import { Layer } from "./Layer";
import { execute as movieClipRunUseCase } from "@/core/application/MovieClip/usecase/MovieClipRunUseCase";
import { execute as movieClipStopUseCase } from "@/core/application/MovieClip/usecase/MovieClipStopUseCase";
import { execute as movieClipCreateCanvasElementUseCase } from "@/core/application/MovieClip/usecase/MovieClipCreateCanvasElementUseCase";
import { $clamp } from "@/global/GlobalUtil";
import { execute as movieClipCreateJsonUseCase } from "@/core/application/MovieClip/usecase/MovieClipCreateJsonUseCase";
import { MovieClipPublishJsonImpl } from "@/interface/MovieClipPublishJsonImpl";
import { BoundsImpl } from "@/interface/BoundsImpl";

/**
 * @description MovieClipの状態管理クラス
 *              MovieClip state management class
 *
 * @class
 * @public
 * @extends {Instance}
 */
export class MovieClip extends Instance
{
    private _$currentFrame: number;
    private _$leftFrame: number;
    private _$scrollX: number;
    private _$scrollY: number;
    private _$active: boolean;
    private readonly _$labels: Map<number, string>;
    private readonly _$layers: Layer[];
    private readonly _$actions: Map<number, string>;
    private readonly _$sounds: Map<number, SoundObjectImpl[]>;
    private readonly _$selectedLayers: Layer[];
    private readonly _$selectedFrameObject: FrameObjectImpl;
    private readonly _$selectedDepths: Map<number, number[]>;

    /**
     * @params {object} object
     * @constructs
     * @public
     */
    constructor (object: MovieClipSaveObjectImpl)
    {
        super(object);

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$active = false;

        /**
         * @type {Map}
         * @private
         */
        this._$labels = new Map();

        /**
         * @type {array}
         * @private
         */
        this._$layers = [];

        /**
         * @type {Map}
         * @private
         */
        this._$actions = new Map();

        /**
         * @type {Map}
         * @private
         */
        this._$sounds = new Map();

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$currentFrame = 1;

        /**
         * @type {number}
         * @default 1
         * @private
         */
        this._$leftFrame = 1;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$scrollX = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$scrollY = 0;

        /**
         * @type {array}
         * @private
         */
        this._$selectedLayers = [];

        /**
         * @type {object}
         * @private
         */
        this._$selectedFrameObject = {
            "start": 0,
            "end": 0
        };

        /**
         * @type {Map}
         * @private
         */
        this._$selectedDepths = new Map();

        // 指定objectからMovieCLipを復元
        this.load(object);
    }

    /**
     * @description 選択中のDisplayObjectのマップデータを返却
     *              Returns the map data of the selected DisplayObject
     *
     * @member {Map}
     * @readonly
     * @public
     */
    get selectedDepths (): Map<number, number[]>
    {
        return this._$selectedDepths;
    }

    /**
     * @description MovieClipの幅を返す
     *              Returns the width of the MovieClip
     *
     * @member {number}
     * @public
     */
    get width (): number
    {
        return 100;
    }
    set width (width: number)
    {
        // TODO
        console.log(width);
    }

    /**
     * @description MovieClipの高さを返す
     *              Returns the height of the MovieClip
     *
     * @return {number}
     * @public
     */
    get height (): number
    {
        return 100;
    }
    set height (height: number)
    {
        // TODO
        console.log(height);
    }

    /**
     * @description フレームの選択状態を保存したオブジェクトを返却
     *              Returns an object with the frame selection state saved
     *
     * @return {object}
     * @readonly
     * @public
     */
    get selectedFrameObject (): FrameObjectImpl
    {
        return this._$selectedFrameObject;
    }

    /**
     * @description 選択しているDisplayObjectが単一か判定
     *              Determine if the selected DisplayObject is single.
     *
     * @return {boolean}
     * @method
     * @public
     */
    isSingleSelectedOfDisplayObject (): boolean
    {
        if (!this._$selectedDepths.size || this._$selectedDepths.size > 1) {
            return false;
        }

        return this._$selectedDepths.values().next().value.length === 1;
    }

    /**
     * @description 選択したフレームの最小値を返却
     *              Returns the minimum value for the selected frame
     *
     * @return {number}
     * @readonly
     * @public
     */
    get selectedStartFrame (): number
    {
        return Math.min(
            this._$selectedFrameObject.start,
            this._$selectedFrameObject.end
        );
    }

    /**
     * @description 選択したフレームの最大値を返却
     *              Returns the maximum value for the selected frame
     *
     * @return {number}
     * @readonly
     * @public
     */
    get selectedEndFrame (): number
    {
        return Math.max(
            this._$selectedFrameObject.start,
            this._$selectedFrameObject.end
        ) + 1;
    }
    /**
     * @description HTMLCanvasElementを返却
     *              Return HTMLCanvasElement
     *
     * @return {Promise}
     * @method
     * @public
     */
    async getHTMLElement (frame: number = 1): Promise<HTMLCanvasElement>
    {
        return movieClipCreateCanvasElementUseCase(this, frame);
    }

    /**
     * @description Next2D PlayerのMovieClipインスタンスを返却
     *              Returns the MovieClip instance of Next2D Player
     *
     * @return {any}
     * @method
     * @public
     */
    async toPublish (): Promise<MovieClipPublishJsonImpl>
    {
        return await movieClipCreateJsonUseCase(this);
    }

    /**
     * @description タイムラインで選択したLayerの配列を返却
     *              Returns an array of Layers selected on the timeline
     *
     * @member {array}
     * @readonly
     * @public
     */
    get selectedLayers (): Layer[]
    {
        return this._$selectedLayers;
    }

    /**
     * @description タイムラインで選択したLayerの配列を昇順に並び替えて返却
     *              Returns an array of Layers selected on the timeline in ascending order
     *
     * @member {array}
     * @readonly
     * @public
     */
    getCloneAndSortSelectedLayers (): Layer[]
    {
        return this
            ._$selectedLayers
            // 複製
            .slice()
            // 昇順に並び替え
            .sort((a: Layer, b: Layer): number =>
            {
                return this.layers.indexOf(a) - this.layers.indexOf(b);
            });
    }

    /**
     * @description 選択中のDisplayObjectを初期化
     *              Initialize the selected DisplayObject
     *
     * @return {void}
     * @method
     * @public
     */
    clearSelectedDepths (): void
    {
        this._$selectedDepths.clear();
    }

    /**
     * @description 選択中のLayerを初期化
     *              Initialize the currently selected Layer
     *
     * @return {void}
     * @method
     * @public
     */
    clearSelectedLayer (): void
    {
        this._$selectedLayers.length = 0;
    }

    /**
     * @description 選択中のフレームを初期化
     *              Initialize the currently selected frame
     *
     * @return {void}
     * @method
     * @public
     */
    clearSelectedFrame (): void
    {
        this._$selectedFrameObject.start = 0;
        this._$selectedFrameObject.end   = 0;
    }

    /**
     * @description タイムラインのスクロールのx座標
     *              x-coordinate of timeline scrolling
     *
     * @member {number}
     * @public
     */
    get scrollX (): number
    {
        return this._$scrollX;
    }
    set scrollX (scroll_x: number)
    {
        this._$scrollX = scroll_x;
    }

    /**
     * @description タイムラインのスクロールのy座標
     *              y-coordinate of timeline scrolling
     *
     * @member {number}
     * @public
     */
    get scrollY (): number
    {
        return this._$scrollY;
    }
    set scrollY (scroll_y: number)
    {
        this._$scrollY = scroll_y;
    }

    /**
     * @description MovieClipのLayerの配列を返却する
     *              Returns an array of MovieClip Layers
     *
     * @member {Map}
     * @readonly
     * @public
     */
    get layers (): Layer[]
    {
        return this._$layers;
    }

    /**
     * @description タイムラインマーカーが指定してるフレーム番号
     *              The frame number specified by the timeline marker.
     *
     * @member {array}
     * @public
     */
    get currentFrame (): number
    {
        return this._$currentFrame;
    }
    set currentFrame (current_frame: number)
    {
        this._$currentFrame = current_frame;
    }

    /**
     * @description MovieClipのレイヤーに設定されてるフレームの最小値を返却
     *              Returns the minimum value of the frame set in the MovieClip Layer
     *
     * @member {number}
     * @readonly
     * @public
     */
    get minFrame (): number
    {
        let minFrame = 1;
        for (let idx = 0; idx < this._$layers.length; ++idx) {
            minFrame = Math.min(minFrame, this._$layers[idx].minFrame);
        }
        return minFrame;
    }

    /**
     * @description MovieClipのレイヤーに設定されてるフレームの最大値を返却
     *              Returns the maximum value of the frame set in the MovieClip Layer
     *
     * @member {number}
     * @readonly
     * @public
     */
    get maxFrame (): number
    {
        let maxFrame = 0;
        for (let idx = 0; idx < this._$layers.length; ++idx) {
            maxFrame = Math.max(maxFrame, this._$layers[idx].maxFrame);
        }
        return maxFrame;
    }

    /**
     * @description MovieClipの起動状態を返却
     *              Return MovieClip startup status
     *
     * @member {boolean}
     * @readonly
     * @public
     */
    get active (): boolean
    {
        return this._$active;
    }

    /**
     * @description MovieClipの起動関数
     *              MovieClip startup functions
     *
     * @returns {Promise}
     * @method
     * @public
     */
    async run (): Promise<void>
    {
        // 起動処理を実行
        await movieClipRunUseCase(this);

        // 状態をアクティブに更新
        this._$active = true;
    }

    /**
     * @description 表示されてるMovieClipの終了処理
     *              Termination of the displayed MovieClip
     *
     * @returns {void}
     * @method
     * @public
     */
    stop (): void
    {
        // 終了処理を実行
        movieClipStopUseCase();

        // 状態を非アクティブに更新
        this._$active = false;
    }

    /**
     * @description 保存データからMovieClipを復元
     *              Recover MovieClip from saved data
     *
     * @param   {object} object
     * @returns {void}
     * @method
     * @public
     */
    load (object: MovieClipSaveObjectImpl): void
    {
        if (object.layers && object.layers.length) {

            // reset
            this._$layers.length = 0;
            // セーブデータからLayerを複製
            for (let idx: number = 0; idx < object.layers.length; ++idx) {

                const saveObject = object.layers[idx];

                // セーブデータの読み込み
                const layer = this.createLayer();
                layer.load(saveObject);

                // 登録
                this._$layers.push(layer);
            }

        } else {
            // Layerデータがなければ強制的に一個追加する
            this.setLayer(this.createLayer(), 0);
        }

        if (object.scrollX) {
            this._$scrollX = object.scrollX;
        }

        if (object.scrollY) {
            this._$scrollY = object.scrollY;
        }

        if (object.currentFrame) {
            this._$currentFrame = object.currentFrame;
        }

        // ラベル情報を再登録
        if (object.labels) {
            for (let idx = 0; idx < object.labels.length; ++idx) {
                const labelObject = object.labels[idx];
                this._$labels.set(labelObject.frame, labelObject.name);
            }
        }

        // スクリプトマップに再登録
        if (object.actions) {
            for (let idx = 0; idx < object.actions.length; ++idx) {
                const actionObject: ActionSaveObjectImpl = object.actions[idx];
                this._$actions.set(actionObject.frame, actionObject.action);
            }
        }

        // サウンド情報を再登録
        if (object.sounds) {
            for (let idx = 0; idx < object.sounds.length; ++idx) {
                const soundObject: SoundSaveListImpl = object.sounds[idx];
                this._$sounds.set(soundObject.frame, soundObject.sounds);
            }
        }
    }

    /**
     * @description 新規レイヤーを作成
     *              新規レイヤーを作成
     *
     * @return {Layer}
     * @method
     * @public
     */
    createLayer (): Layer
    {
        const layer = new Layer();

        layer.name = `Layer_${this._$layers.length}`;

        // IDを発番
        let layerId = 0;
        for (let idx = 0; idx < this._$layers.length; ++idx ) {
            const layer = this._$layers[idx];
            if (!layer) {
                continue;
            }
            layerId = Math.max(layerId, layer.id);
        }
        layer.id = layerId + 1;

        return layer;
    }

    /**
     * @description 配列の指定index値にLayerを追加
     *              Add Layer to the specified index value of the array
     *
     * @param  {Layer} layer
     * @param  {number} index
     * @return {void}
     * @method
     * @public
     */
    setLayer (layer: Layer, index: number): void
    {
        const targetIndex = $clamp(index, 0, this._$layers.length);

        if (targetIndex >= this._$layers.length) {
            this._$layers.push(layer);
        } else {
            // 指定のindexの前に挿入
            this._$layers.splice(targetIndex, 0, layer);
        }
    }

    /**
     * @description 指定のLayerを内部情報から削除
     *              Delete specified Layer from internal information
     *
     * @param  {Layer} layer
     * @return {void}
     * @method
     * @public
     */
    deleteLayer (layer: Layer): void
    {
        // 選択情報から削除
        this.deactivatedLayer(layer);

        // 内部情報から削除
        const index = this._$layers.indexOf(layer);
        if (index > -1) {
            this._$layers.splice(index, 1);
        }
    }

    /**
     * @description 指定Layerを内部アクティブ情報から削除
     *              Delete specified Layer from internal active information
     *
     * @param  {Layer} layer
     * @return {void}
     * @method
     * @public
     */
    deactivatedLayer (layer: Layer): void
    {
        const index = this._$selectedLayers.indexOf(layer);
        if (index > -1) {
            this._$selectedLayers.splice(index, 1);
        }
    }

    /**
     * @description 指定IDのLayerを返却
     *              Returns the Layer with the specified ID.
     *
     * @param  {number} index
     * @return {Layer | null}
     * @method
     * @public
     */
    getLayer (index: number): Layer | null
    {
        return index in this._$layers
            ? this._$layers[index] as NonNullable<Layer>
            : null;
    }

    /**
     * @description 指定IDのLayerを返却
     *              Returns the Layer with the specified ID
     *
     * @param {number} id
     * @return {Layer | null}
     * @method
     * @public
     */
    getLayerById (id: number): Layer | null
    {
        for (let idx = 0; idx < this._$layers.length; ++idx) {
            if (this._$layers[idx].id === id) {
                return this._$layers[idx];
            }
        }
        return null;
    }

    /**
     * @description ラベルのマップデータを返却
     *              Returns label map data
     *
     * @return {Map}
     * @readonly
     * @public
     */
    get labels (): Map<number, string>
    {
        return this._$labels;
    }

    /**
     * @description 指定フレームのラベル名を返す
     *              Returns the label name of the specified frame.
     *
     * @param  {number} frame
     * @return {string}
     * @method
     * @public
     */
    getLabel (frame: number): string
    {
        return this.hasLabel(frame)
            ? this._$labels.get(frame) as string
            : "";
    }

    /**
     * @description 指定フレームにラベル名をセットする
     *              Sets the label name in the specified frame.
     *
     * @param  {number} frame
     * @param  {string} name
     * @return {void}
     * @method
     * @public
     */
    setLabel (frame: number, name: string): void
    {
        this._$labels.set(frame, name);
    }

    /**
     * @description 指定フレームにラベル情報が設置されているか判定
     *              Judges whether label information is installed in the specified frame.
     *
     * @param  {number} frame
     * @return {boolean}
     * @method
     * @public
     */
    hasLabel (frame: number): boolean
    {
        return this._$labels.has(frame);
    }

    /**
     * @description 指定フレームに設置したラベル情報を削除
     *              Delete label information placed in the specified frame
     *
     * @param  {number} frame
     * @return {boolean}
     * @method
     * @public
     */
    deleteLabel (frame: number): boolean
    {
        return this._$labels.delete(frame);
    }

    /**
     * @description 指定したフレームのサウンド情報を配列で返す
     *              Returns an array of sound information for a given frame
     *
     * @param  {number} frame
     * @return {object[] | null}
     * @method
     * @public
     */
    getSound (frame: number): SoundObjectImpl[] | null
    {
        return this.hasSound(frame)
            ? this._$sounds.get(frame) as SoundObjectImpl[]
            : null;
    }

    /**
     * @description 指定したフレームにサウンド情報を登録
     *              Register sound information to the specified frame
     *
     * @param  {number} frame
     * @param  {object} sound
     * @return {void}
     * @method
     * @public
     */
    setSound (frame: number, sound: SoundObjectImpl): void
    {
        if (!this.hasSound(frame)) {
            this._$sounds.set(frame, []);
        }
        this._$sounds.get(frame)?.push(sound);
    }

    /**
     * @description 指定したフレームにサウンド情報が設置されているか判定
     *              Determines if sound information is installed in the specified frame
     *
     * @param  {number} frame
     * @return {boolean}
     * @method
     * @public
     */
    hasSound (frame: number): boolean
    {
        return this._$sounds.has(frame);
    }

    /**
     * @description 指定したフレームのサウンド情報を削除
     *              Delete sound information for the specified frame
     *
     * @param  {number} frame
     * @return {boolean}
     * @method
     * @public
     */
    deleteSound (frame: number): boolean
    {
        return this._$sounds.delete(frame);
    }

    /**
     * @description サウンドのマップデータを返却
     *              Returns sound map data
     *
     * @return {Map}
     * @readonly
     * @public
     */
    get sounds (): Map<number, SoundObjectImpl[]>
    {
        return this._$sounds;
    }

    /**
     * @description スクリプトのマップデータを返却
     *              Return script map data
     *
     * @return {Map}
     * @readonly
     * @public
     */
    get actions (): Map<number, string>
    {
        return this._$actions;
    }

    /**
     * @description 指定したフレームのJavaScript情報を返す
     *              Returns JavaScript information for the specified frame
     *
     * @param  {number} frame
     * @return {string}
     * @method
     * @public
     */
    getAction (frame: number): string
    {
        return this.hasAction(frame)
            ? this._$actions.get(frame) as string
            : "";
    }

    /**
     * @description 指定したフレームにJavaScript情報を登録する
     *              Register JavaScript information in the specified frame
     *
     * @param  {number} frame
     * @param  {string} script
     * @return {void}
     * @method
     * @public
     */
    setAction (frame: number, script: string): void
    {
        this._$actions.set(frame, script);
    }

    /**
     * @description 指定フレームにJavaScript情報の設定の有無を判定
     *              Judges whether JavaScript information is set in the specified frame.
     *
     * @param  {number} frame
     * @return {boolean}
     * @method
     * @public
     */
    hasAction (frame: number): boolean
    {
        return this._$actions.has(frame);
    }

    /**
     * @description 指定フレームのJavaScript情報を削除
     *              Delete JavaScript information for specified frames
     *
     * @param  {number} frame
     * @return {boolean}
     * @method
     * @public
     */
    deleteAction (frame: number): boolean
    {
        return this._$actions.delete(frame);
    }

    /**
     * @description プレーンなバウンディングボックスを返す
     *              Returns a plain bounding box
     *
     * @return {object}
     * @method
     * @public
     */
    getRawBounds (): BoundsImpl
    {
        return {
            "xMin": 0,
            "yMin": 0,
            "xMax": this.width,
            "yMax": this.height
        };
    }

    /**
     * @description セーブオブジェクトに変換
     *              Convert to save object
     *
     * @return {object}
     * @method
     * @public
     */
    toObject (): MovieClipSaveObjectImpl
    {
        const layers = [];
        for (let idx: number = 0; idx < this._$layers.length; ++idx) {
            layers.push(this._$layers[idx].toObject());
        }

        const labels = [];
        for (const [frame, value] of this._$labels) {
            labels.push({
                "frame": frame,
                "name": value
            });
        }

        const actions: ActionSaveObjectImpl[] = [];
        for (const [frame, action] of this._$actions) {
            actions.push({
                "frame": frame,
                "action": action
            });
        }

        const soundList: SoundSaveListImpl[] = [];
        for (const [frame, sounds] of this._$sounds) {
            soundList.push({
                "frame": frame,
                "sounds": sounds
            });
        }

        return {
            "id":           this.id,
            "name":         this.name,
            "type":         this.type,
            "symbol":       this.symbol,
            "folderId":     this.folderId,
            "currentFrame": this._$currentFrame,
            "leftFrame":    this._$leftFrame,
            "layers":       layers,
            "labels":       labels,
            "sounds":       soundList,
            "actions":      actions,
            "scrollX":      this._$scrollX,
            "scrollY":      this._$scrollY
        };
    }
}