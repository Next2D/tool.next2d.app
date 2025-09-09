import type { IStageObject } from "@/interface/IStageObject";
import { execute as stageRunUseCase } from "@/core/application/Stage/usecase/StageRunUseCase";
import {
    $STAGE_DEFAULT_FPS,
    $STAGE_DEFAULT_HEIGHT,
    $STAGE_DEFAULT_WIDTH,
    $STAGE_DEFAULT_COLOR
} from "@/config/StageSettingConfig";

/**
 * @description スクリーンエリアのステージの管理クラス
 *              Management class for screen area stages
 *
 * @class
 * @public
 */
export class Stage
{
    /**
     * @description ステージの表示の幅
     *              Stage display width
     *
     * @member {number}
     * @default $STAGE_DEFAULT_WIDTH
     * @public
     */
    public width: number;

    /**
     * @description ステージの表示の高さ
     *              Stage display height
     *
     * @member {number}
     * @default $STAGE_DEFAULT_HEIGHT
     * @public
     */
    public height: number;

    /**
     * @description ステージの描画速度の設定
     *              Set the stage drawing speed.
     *
     * @member {number}
     * @default $STAGE_DEFAULT_FPS
     * @public
     */
    public fps: number;

    /**
     * @description ステージの背景色の設定
     *              Setting the background color of the stage
     *
     * @member {string}
     * @default $STAGE_DEFAULT_COLOR
     * @public
     */
    public bgColor: string;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this.width   = $STAGE_DEFAULT_WIDTH;
        this.height  = $STAGE_DEFAULT_HEIGHT;
        this.fps     = $STAGE_DEFAULT_FPS;
        this.bgColor = $STAGE_DEFAULT_COLOR;
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
        stageRunUseCase(this);
    }

    /**
     * @description セーブオブジェクトに変換
     *              Convert to save object
     *
     * @return {object}
     * @method
     * @public
     */
    toObject (): IStageObject
    {
        return {
            "width": this.width,
            "height": this.height,
            "fps": this.fps,
            "bgColor": this.bgColor
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
    load (object: IStageObject): void
    {
        this.width   = object.width;
        this.height  = object.height;
        this.fps     = object.fps;
        this.bgColor = object.bgColor;
    }
}