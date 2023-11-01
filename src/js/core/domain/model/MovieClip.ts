import { MovieClipObjectImpl } from "../../../interface/MovieClipObjectImpl";
import { Instance } from "./Instance";
import { execute as timelineHeaderBuildElementUseCase } from "../../../timeline/application/TimelineHeader/usecase/TimelineHeaderBuildElementUseCase";
import { execute as timelineLayerBuildElementUseCase } from "../../../timeline/application/TimelineLayer/usecase/TimelineLayerBuildElementUseCase";
import { Layer } from "./Layer";
import { timelineLayer } from "../../../timeline/application/TimelineUtil";
import type { Sound } from "./Sound";

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
    private readonly _$labels: Map<number, string>;
    private readonly _$layers: Layer[];
    private readonly _$actions: Map<number, string>;
    private readonly _$sounds: Map<number, Sound[]>;

    /**
     * @params {object} object
     * @constructs
     * @public
     */
    constructor (object: MovieClipObjectImpl)
    {
        super(object);

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

        // 指定objectからMovieCLipを復元
        this.load(object);
    }

    /**
     * @description MovieClipのLayerのMapデータを返却する
     *              Return Map data of Layer in MovieClip
     *
     * @member {array}
     * @public
     */
    get layers (): Layer[]
    {
        return this._$layers;
    }

    /**
     * @description MovieClipの起動関数
     *              MovieClip startup functions
     *
     * @returns {Promise}
     * @method
     * @public
     */
    run (): Promise<void>
    {
        return new Promise((resolve) =>
        {
            // タイムラインのヘッダーを生成
            timelineHeaderBuildElementUseCase();

            // MovieClipのLayerからタイムラインを生成
            timelineLayerBuildElementUseCase();

            return resolve();
        });
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
        // 表示に利用していたレイヤーElementを非表示に更新
        for (let idx = 0; idx < this._$layers.length; ++idx) {
            const element = timelineLayer.elements[idx];
            element.style.display = "none";
        }

        // TODO
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
    load (object: MovieClipObjectImpl): void
    {
        // Layerデータがなければ強制的に一個追加する
        if (!object.layers) {
            const layer = new Layer();
            layer.name  = "Layer_0";
            this._$layers.push(layer);
        }
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
     * @return {Sound[]}
     * @method
     * @public
     */
    getSound (frame: number): Sound[]
    {
        return this.hasSound(frame)
            ? this._$sounds.get(frame) as Sound[]
            : [];
    }

    /**
     * @description 指定したフレームにサウンド情報を登録
     *              Register sound information to the specified frame
     *
     * @param  {number} frame
     * @param  {Sound[]} sounds
     * @return {void}
     * @method
     * @public
     */
    setSound (frame: number, sounds: Sound[]): void
    {
        this._$sounds.set(frame, sounds);
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

        // TODO コントローラーのJavaScriptタブを再読み込み
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

        // TODO コントローラーのJavaScriptタブを再読み込み
    }
}