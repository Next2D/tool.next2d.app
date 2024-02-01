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
    private _$clientWidth: number;
    private readonly _$elements: HTMLElement[];

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$clientWidth = 0;

        /**
         * @type {array}
         * @private
         */
        this._$elements = [];
    }

    /**
     * @description ヘッダーコンテンツのElement配列
     *              Element array of header content
     *
     * @readonly
     * @return {array}
     * @public
     */
    get elements (): HTMLElement[]
    {
        return this._$elements;
    }

    /**
     * @description 初期起動関数
     *              initial invoking function
     *
     * @return {Promise}
     * @method
     * @public
     */
    initialize (): Promise<void>
    {
        return new Promise((resolve): void =>
        {
            timelineHeaderInitializeUseCase();

            // 終了
            resolve();
        });
    }

    /**
     * @description タイムラインヘッダーの表示幅を返却する
     *              Return the display width of the timeline header
     *
     * @member {number}
     * @public
     */
    get clientWidth (): number
    {
        return this._$clientWidth;
    }
    set clientWidth (width: number)
    {
        this._$clientWidth = width;
    }
}

export const timelineHeader = new TimelineHeader();