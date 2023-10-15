import { StageObjectImpl } from "../../interface/StageObjectImpl";
import { execute as stageInitializeUseCase } from "../usecase/StageInitializeUsecase";
import { $clamp } from "../../util/Global";
import {
    STAGE_DEFAULT_FPS,
    STAGE_DEFAULT_HEIGHT,
    STAGE_DEFAULT_WIDTH,
    STAGE_DEFAULT_COLOR
} from "../../const/StageConfig";

/**
 * @description スクリーンエリアのステージの管理クラス
 *              Management class for screen area stages
 *
 * @class
 * @public
 */
export class Stage
{
    private _$width: number;
    private _$height: number;
    private _$fps: number;
    private _$bgColor: string;
    private _$lock: boolean;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {number}
         * @default STAGE_DEFAULT_WIDTH
         * @private
         */
        this._$width = STAGE_DEFAULT_WIDTH;

        /**
         * @type {number}
         * @default STAGE_DEFAULT_HEIGHT
         * @private
         */
        this._$height = STAGE_DEFAULT_HEIGHT;

        /**
         * @type {number}
         * @default STAGE_DEFAULT_FPS
         * @private
         */
        this._$fps = STAGE_DEFAULT_FPS;

        /**
         * @type {number}
         * @default STAGE_DEFAULT_COLOR
         * @private
         */
        this._$bgColor = STAGE_DEFAULT_COLOR;

        /**
         * @type {boolean}
         * @default STAGE_DEFAULT_WIDTH
         * @private
         */
        this._$lock = false;
    }

    /**
     * @description ステージの表示の幅
     *              Stage display width
     *
     * @member {number}
     * @default STAGE_DEFAULT_WIDTH
     * @public
     */
    get width (): number
    {
        return this._$width;
    }
    set width (width: number)
    {
        this._$width = $clamp(+width, 1, 1024 * 4);
    }

    /**
     * @description ステージの表示の高さ
     *              Stage display height
     *
     * @member {number}
     * @default STAGE_DEFAULT_HEIGHT
     * @public
     */
    get height (): number
    {
        return this._$height;
    }
    set height (height: number)
    {
        this._$height = $clamp(+height, 1, 1024 * 4);
    }

    /**
     * @description ステージの描画速度の設定
     *              Set the stage drawing speed.
     *
     * @member {number}
     * @default STAGE_DEFAULT_FPS
     * @public
     */
    get fps (): number
    {
        return this._$fps;
    }
    set fps (fps: number)
    {
        this._$fps = $clamp(fps | 0, 1, 60);
    }

    /**
     * @description ステージの背景色の設定
     *              Setting the background color of the stage
     *
     * @return {string}
     * @default STAGE_DEFAULT_COLOR
     * @public
     */
    get bgColor (): string
    {
        return this._$bgColor;
    }
    set bgColor (color: string)
    {
        this._$bgColor = `${color}`.toLowerCase();
    }

    /**
     * @description 幅と高さのサイズ変更を同時に行う設定
     *              Set to resize width and height at the same time
     *
     * @member {boolean}
     * @default false
     * @public
     */
    get lock (): boolean
    {
        return this._$lock;
    }
    set lock (lock: boolean)
    {
        this._$lock = !!lock;
    }

    /**
     * @description クラス内の変数をObjectにして返す
     *              Return variables in a class as Objects
     *
     * @return {object}
     * @method
     * @public
     */
    run (): void
    {
        stageInitializeUseCase(this);
    }

    /**
     * @description クラス内の変数をObjectにして返す
     *              Return variables in a class as Objects
     *
     * @return {object}
     * @method
     * @public
     */
    toObject (): StageObjectImpl
    {
        return {
            "width": this.width,
            "height": this.height,
            "fps": this.fps,
            "bgColor": this.bgColor,
            "lock": this.lock
        };
    }

    /**
     * @description セーブデータからステージ情報を読み込む
     *              Load stage information from saved data
     *
     * @param  {object} object
     * @return {void}
     * @method
     * @public
     */
    load (object: StageObjectImpl): void
    {
        this._$width   = object.width;
        this._$height  = object.height;
        this._$fps     = object.fps;
        this._$bgColor = object.bgColor;
        this._$lock    = object.lock;
    }
}