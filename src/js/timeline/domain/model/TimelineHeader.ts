import { execute as timelineHeaderInitializeUseCase } from "../../application/TimelineHeader/usecase/TimelineHeaderInitializeUseCase";

/**
 * @description タイムラインのヘッダーの管理クラス
 *              Management class for timeline headers
 *
 * @class
 * @public
 */
class TimelineHeader
{
    /**
     * @description タイムラインヘッダーの表示幅を返却する
     *              Return the display width of the timeline header
     *
     * @member {number}
     * @public
     */
    public clientWidth: number;

    /**
     * @description タイムラインの再生停止フラグ
     *              Playback stop flag of the timeline
     *
     * @member {boolean}
     * @public
     */
    public stopFlag: boolean;

    /**
     * @description タイムラインのループフラグ
     *              Loop flag of the timeline
     *
     * @member {boolean}
     * @public
     */
    public loopFlag: boolean;

    /**
     * @description ヘッダーコンテンツのElement配列
     *              Element array of header content
     *
     * @readonly
     * @return {array}
     * @public
     */
    public readonly elements: HTMLElement[];

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this.clientWidth = 0;
        this.elements = [];
        this.stopFlag = true;
        this.loopFlag = false;
    }

    /**
     * @description 初期起動関数
     *              initial invoking function
     *
     * @return {Promise}
     * @method
     * @public
     */
    async initialize (): Promise<void>
    {
        timelineHeaderInitializeUseCase();
    }
}

export const timelineHeader = new TimelineHeader();