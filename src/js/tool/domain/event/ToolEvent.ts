import { EventDispatcher } from "./EventDispatcher";
import { EventType } from "./EventType";
import { $setCursor } from "@/global/GlobalUtil";
import { $TOOL_PREFIX } from "@/config/ToolConfig";

/**
 * @description ツールのイベント後の状態管理クラス
 *              Post-event state management class for the tool
 *
 * @class
 * @public
 * @extends {BaseTool}
 */
export class ToolEvent extends EventDispatcher
{
    private _$name: string;
    private _$active: boolean;
    private _$target: HTMLDivElement | null;

    /**
     * @param {string} name
     * @constructor
     * @public
     */
    constructor (name: string = "")
    {
        super();

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$name = `${name}`;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$active = false;

        /**
         * @type {HTMLDivElement}
         * @default null
         * @private
         */
        this._$target = null;

        // private initialize function
        this._$initialize();
    }

    /**
     * @description ツールに必要な初期イベントを登録
     *              Register initial events required for the tool
     *
     * @require {void}
     * @method
     * @private
     */
    _$initialize (): void
    {
        // マウスダウン時にアクティブ化
        this.addEventListener(EventType.MOUSE_DOWN, (event: PointerEvent): void =>
        {
            // 親のイベントを中止する
            event.stopPropagation();

            // ツールをアクティブ化
            this.activation(event);
        });

        // マウスアップ時に非アクティブ化
        this.addEventListener(EventType.MOUSE_UP, (event: PointerEvent): void =>
        {
            // 親のイベントを中止する
            event.stopPropagation();

            // ツールを非アクティブ化
            this.termination();
        });

        // ツールの開始時の起動イベント
        this.addEventListener(EventType.START, (): void =>
        {
            this.toolStart();
        });

        // ツールの終了時の起動イベント
        this.addEventListener(EventType.END, (): void =>
        {
            this.toolEnd();
        });
    }

    /**
     * @return {string}
     * @readonly
     * @public
     */
    get name (): string
    {
        return this._$name;
    }

    /**
     * @description ツールが選択されていれば、true。選択が終了したらfalseになります。
     *              True if the tool is selected; false if the selection is finished.
     *
     * @default false
     * @member {boolean}
     * @public
     */
    get active (): boolean
    {
        return this._$active;
    }
    set active (active: boolean)
    {
        this._$active = !!active;
    }

    /**
     * @description 選択されたツールで利用するElement
     *              Element to be used with the selected tool
     *
     * @default null
     * @member {HTMLDivElement}
     * @public
     */
    get target (): HTMLDivElement | null
    {
        return this._$target;
    }
    set target (target: HTMLDivElement | null)
    {
        this._$target = target;
    }

    /**
     * @description ツール選択時は変数をアクティブ化
     *              Variables are activated when the tool is selected
     *
     * @param  {PointerEvent} event
     * @return {void}
     * @method
     * @public
     */
    activation (event: PointerEvent): void
    {
        this._$active = true;
        this._$target = event.currentTarget as HTMLDivElement;
    }

    /**
     * @description ツール選択終了したら変数を非アクティブ化
     *              Deactivate variables when tool selection is finished
     *
     * @return {void}
     * @method
     * @public
     */
    termination (): void
    {
        this._$active = false;
        this._$target = null;
    }

    /**
     * @description ツール切り替え、開始時のイベント関数
     *              Tool switching, event function at start
     *
     * @return {void}
     * @method
     * @public
     */
    toolStart (): void
    {
        // カーソルをリセット
        $setCursor("auto");

        // 対象のElementがあればアクティブ表示
        const element: HTMLElement | null = document
            .getElementById(`${$TOOL_PREFIX}-${this._$name}`);

        if (!element || element.dataset.mode !== "tool") {
            return ;
        }

        element.classList.add("active");
    }

    /**
     * @description ツール切り替え、終了時のイベント関数
     *              Event functions for tool switching and exit
     *
     * @return {void}
     * @method
     * @public
     */
    toolEnd (): void
    {
        // カーソルをリセット
        $setCursor("auto");

        // 対象のElementがあれば非アクティブ表示
        const element: HTMLElement | null = document
            .getElementById(`${$TOOL_PREFIX}-${this._$name}`);

        if (element) {
            element.classList.remove("active");
        }
    }
}