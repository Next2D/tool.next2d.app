import { $TIMELINE_CONTROLLER_BASE_ID } from "../../../config/TimelineConfig";
import { execute as timelineInitializeUseCase } from "../../application/TimelineHeader/usecase/TimelineInitializeUseCase";

/**
 * @description タイムラインのヘッダーの管理クラス
 *              Management class for timeline headers
 *
 * @class
 * @public
 */
export class TimelineHeader
{
    private _$clientWidth: number;
    private _$scrollX: number;

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
         * @type {number}
         * @default 0
         * @private
         */
        this._$scrollX = 0;
    }

    /**
     * @description 初期起動関数
     *              initial invoking function
     *
     * @return {void}
     * @method
     * @public
     */
    initialize (): Promise<void>
    {
        return new Promise((resolve): void =>
        {
            const element: HTMLElement | null = document
                .getElementById($TIMELINE_CONTROLLER_BASE_ID);

            if (element) {
                this._$clientWidth = element.clientWidth | 0;
            }

            timelineInitializeUseCase();

            // 終了
            resolve();
        });
    }

    /**
     * @description コンテナの表示幅を返却する
     *              Return container display width
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