import { EventType } from "../event/EventType";
import { BaseTool } from "./BaseTool";
import { execute as userSettingMouseDownEventService } from "../../application/usecase/UserSettingMouseUpEventUseCase";

/**
 * @description 設定ツールの管理クラス
 *              Configuration tool management class
 *
 * @class
 * @public
 * @extends {BaseTool}
 */
export class UserSettingTool extends BaseTool
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super("setting");
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
        // 各種イベントを登録
        this._$registerEvent();
    }

    /**
     * @description 初期起動時に各種イベントを登録
     *              Register various events at initial startup
     *
     * @return {void}
     * @method
     * @public
     */
    _$registerEvent (): void
    {
        const element: HTMLElement | null = document
            .getElementById("tools-setting");

        if (element) {
            element.addEventListener(EventType.MOUSE_DOWN, (event: PointerEvent) =>
            {
                userSettingMouseDownEventService(event);
            });
        }
    }
}