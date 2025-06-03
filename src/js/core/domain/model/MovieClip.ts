import type { ISoundObject } from "@/interface/ISoundObject";
import type { IMovieClipSaveObject } from "@/interface/IMovieClipSaveObject";
import type { IActionSaveObject } from "@/interface/IActionSaveObject";
import type { IFrameObject } from "@/interface/IFrameObject";
import type { ISoundSaveList } from "@/interface/ISoundSaveList";
import type { IMovieClipPublishJson } from "@/interface/IMovieClipPublishJson";
import type { IBounds } from "@/interface/IBounds";
import type { Character } from "./Character";
import { execute as movieClipRunUseCase } from "@/core/application/MovieClip/usecase/MovieClipRunUseCase";
import { execute as movieClipStopUseCase } from "@/core/application/MovieClip/usecase/MovieClipStopUseCase";
import { execute as movieClipCreateCanvasElementUseCase } from "@/core/application/MovieClip/usecase/MovieClipCreateCanvasElementUseCase";
import { execute as movieClipCreateJsonUseCase } from "@/core/application/MovieClip/usecase/MovieClipCreateJsonUseCase";
import { execute as movieClipCalcBoundService } from "@/core/application/MovieClip/service/MovieClipCalcBoundService";
import { Instance } from "./Instance";
import { Layer } from "./Layer";
import { $clamp } from "@/global/GlobalUtil";

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
    /**
     * @description タイムラインマーカーが指定してるフレーム番号
     *              The frame number specified by the timeline marker.
     *
     * @member {array}
     * @public
     */
    public currentFrame: number;

    /**
     * @description タイムラインのスクロールのx座標
     *              x-coordinate of timeline scrolling
     *
     * @member {number}
     * @public
     */
    public scrollX: number;

    /**
     * @description タイムラインのスクロールのy座標
     *              y-coordinate of timeline scrolling
     *
     * @member {number}
     * @public
     */
    public scrollY: number;

    /**
     * @description MovieClipの起動状態を返却
     *              Return MovieClip startup status
     *
     * @member {boolean}
     * @public
     */
    public active: boolean;

    /**
     * @description ラベルのマップデータを返却
     *              Returns label map data
     *
     * @return {Map}
     * @readonly
     * @public
     */
    public readonly labels: Map<number, string>;

    /**
     * @description MovieClipのLayerの配列を返却する
     *              Returns an array of MovieClip Layers
     *
     * @member {Map}
     * @readonly
     * @public
     */
    public readonly layers: Layer[];

    /**
     * @description スクリプトのマップデータを返却
     *              Return script map data
     *
     * @return {Map}
     * @readonly
     * @public
     */
    public readonly actions: Map<number, string>;

    /**
     * @description サウンドのマップデータを返却
     *              Returns sound map data
     *
     * @return {Map}
     * @readonly
     * @public
     */
    public readonly sounds: Map<number, ISoundObject[]>;

    /**
     * @description タイムラインで選択したLayerの配列を返却
     *              Returns an array of Layers selected on the timeline
     *
     * @member {array}
     * @readonly
     * @public
     */
    public readonly selectedLayers: Layer[];

    /**
     * @description フレームの選択状態を保存したオブジェクトを返却
     *              Returns an object with the frame selection state saved
     *
     * @return {object}
     * @readonly
     * @public
     */
    public readonly selectedFrameObject: IFrameObject;

    /**
     * @description 選択中のDisplayObjectのマップデータを返却
     *              Returns the map data of the selected DisplayObject
     *
     * @member {Map}
     * @readonly
     * @public
     */
    public readonly selectedDepths: Map<number, number[]>;

    /**
     * @params {object} object
     * @constructs
     * @public
     */
    constructor (object: IMovieClipSaveObject)
    {
        super(object);

        this.labels  = new Map();
        this.actions = new Map();
        this.sounds  = new Map();

        this.currentFrame = 1;
        this.active  = false;
        this.layers  = [];
        this.scrollX = 0;
        this.scrollY = 0;

        this.selectedLayers = [];
        this.selectedDepths = new Map();
        this.selectedFrameObject = {
            "start": 0,
            "end": 0
        };

        // 指定objectからMovieCLipを復元
        this.load(object);
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
        if (!this.selectedDepths.size || this.selectedDepths.size > 1) {
            return false;
        }

        const depths = this.selectedDepths.values().next().value as number[];
        return depths.length === 1;
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
            this.selectedFrameObject.start,
            this.selectedFrameObject.end
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
            this.selectedFrameObject.start,
            this.selectedFrameObject.end
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
    async getHTMLElement (character: Character | null = null, frame: number = 1): Promise<HTMLCanvasElement>
    {
        return await movieClipCreateCanvasElementUseCase(this, character, frame);
    }

    /**
     * @description Next2D PlayerのMovieClipインスタンスを返却
     *              Returns the MovieClip instance of Next2D Player
     *
     * @return {any}
     * @method
     * @public
     */
    async toPublish (): Promise<IMovieClipPublishJson>
    {
        return await movieClipCreateJsonUseCase(this);
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
            .selectedLayers
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
        this.selectedDepths.clear();
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
        this.selectedLayers.length = 0;
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
        this.selectedFrameObject.start = 0;
        this.selectedFrameObject.end   = 0;
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
        for (let idx = 0; idx < this.layers.length; ++idx) {
            minFrame = Math.min(minFrame, this.layers[idx].minFrame);
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
        for (let idx = 0; idx < this.layers.length; ++idx) {
            maxFrame = Math.max(maxFrame, this.layers[idx].maxFrame);
        }
        return maxFrame;
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
        this.active = true;
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
        this.active = false;
    }

    /**
     * @description 保存データからMovieClipを復元
     *              Recover MovieClip from saved data
     *
     * @param   {IMovieClipSaveObject} object
     * @returns {void}
     * @method
     * @public
     */
    load (object: IMovieClipSaveObject): void
    {
        if (object.layers && object.layers.length) {

            // reset
            this.layers.length = 0;
            // セーブデータからLayerを複製
            for (let idx: number = 0; idx < object.layers.length; ++idx) {

                const saveObject = object.layers[idx];

                // セーブデータの読み込み
                const layer = this.createLayer();
                layer.load(saveObject);

                // 登録
                this.layers.push(layer);
            }

        } else {
            // Layerデータがなければ強制的に一個追加する
            this.setLayer(this.createLayer(), 0);
        }

        if (object.scrollX) {
            this.scrollX = object.scrollX;
        }

        if (object.scrollY) {
            this.scrollY = object.scrollY;
        }

        if (object.currentFrame) {
            this.currentFrame = object.currentFrame;
        }

        // ラベル情報を再登録
        if (object.labels) {
            for (let idx = 0; idx < object.labels.length; ++idx) {
                const labelObject = object.labels[idx];
                this.labels.set(labelObject.frame, labelObject.name);
            }
        }

        // スクリプトマップに再登録
        if (object.actions) {
            for (let idx = 0; idx < object.actions.length; ++idx) {
                const actionObject: IActionSaveObject = object.actions[idx];
                this.actions.set(actionObject.frame, actionObject.action);
            }
        }

        // サウンド情報を再登録
        if (object.sounds) {
            for (let idx = 0; idx < object.sounds.length; ++idx) {
                const soundObject: ISoundSaveList = object.sounds[idx];
                this.sounds.set(soundObject.frame, soundObject.sounds);
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

        layer.name = `Layer_${this.layers.length}`;

        // IDを発番
        let layerId = 0;
        for (let idx = 0; idx < this.layers.length; ++idx ) {
            const layer = this.layers[idx];
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
        const targetIndex = $clamp(index, 0, this.layers.length);

        if (targetIndex >= this.layers.length) {
            this.layers.push(layer);
        } else {
            // 指定のindexの前に挿入
            this.layers.splice(targetIndex, 0, layer);
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
        const index = this.layers.indexOf(layer);
        if (index > -1) {
            this.layers.splice(index, 1);
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
        const index = this.selectedLayers.indexOf(layer);
        if (index > -1) {
            this.selectedLayers.splice(index, 1);
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
        return index in this.layers
            ? this.layers[index] as NonNullable<Layer>
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
        for (let idx = 0; idx < this.layers.length; ++idx) {
            if (this.layers[idx].id === id) {
                return this.layers[idx];
            }
        }
        return null;
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
            ? this.labels.get(frame) as string
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
        this.labels.set(frame, name);
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
        return this.labels.has(frame);
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
        return this.labels.delete(frame);
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
    getSound (frame: number): ISoundObject[] | null
    {
        return this.hasSound(frame)
            ? this.sounds.get(frame) as ISoundObject[]
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
    setSound (frame: number, sound: ISoundObject): void
    {
        if (!this.hasSound(frame)) {
            this.sounds.set(frame, []);
        }
        this.sounds.get(frame)?.push(sound);
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
        return this.sounds.has(frame);
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
        return this.sounds.delete(frame);
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
            ? this.actions.get(frame) as string
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
        this.actions.set(frame, script);
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
        return this.actions.has(frame);
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
        return this.actions.delete(frame);
    }

    /**
     * @description プレーンなバウンディングボックスを返す
     *              Returns a plain bounding box
     *
     * @param  {number} [frame=1]
     * @return {object}
     * @method
     * @public
     */
    getRawBounds (frame: number = 1): IBounds
    {
        const calcBounds = movieClipCalcBoundService(this, frame);

        const bounds = {
            "xMin": 0,
            "yMin": 0,
            "xMax": 0,
            "yMax": 0
        };

        if (calcBounds) {
            bounds.xMin = calcBounds.xMin;
            bounds.yMin = calcBounds.yMin;
            bounds.xMax = calcBounds.xMax;
            bounds.yMax = calcBounds.yMax;
        }

        return bounds;
    }

    /**
     * @description セーブオブジェクトに変換
     *              Convert to save object
     *
     * @return {object}
     * @method
     * @public
     */
    toObject (): IMovieClipSaveObject
    {
        const layers = [];
        for (let idx: number = 0; idx < this.layers.length; ++idx) {
            layers.push(this.layers[idx].toObject());
        }

        const labels = [];
        for (const [frame, value] of this.labels) {
            labels.push({
                "frame": frame,
                "name": value
            });
        }

        const actions: IActionSaveObject[] = [];
        for (const [frame, action] of this.actions) {
            actions.push({
                "frame": frame,
                "action": action
            });
        }

        const soundList: ISoundSaveList[] = [];
        for (const [frame, sounds] of this.sounds) {
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
            "currentFrame": this.currentFrame,
            "layers":       layers,
            "labels":       labels,
            "sounds":       soundList,
            "actions":      actions,
            "scrollX":      this.scrollX,
            "scrollY":      this.scrollY
        };
    }
}