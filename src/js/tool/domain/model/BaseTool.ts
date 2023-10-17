import { ToolEvent } from "../event/ToolEvent";
import { EventType } from "../event/EventType";
import { $TOOL_PREFIX } from "../../../config/ToolConfig";
import { execute as toolChangeActiveUseCase } from "../../application/ToolArea/usecase/ToolAreaChangeActiveUseCase";
import {
    $registerDefaultTool
} from "../../application/ToolUtil";

/**
 * @description 各種ツールクラスの親クラス
 *              Parent class of various tool classes
 *
 * @class
 * @public
 * @extends {ToolEvent}
 */
export class BaseTool extends ToolEvent
{
    private _$cursor: string;
    private _$pageX: number;
    private _$pageY: number;
    private _$offsetX: number;
    private _$offsetY: number;

    /**
     * @description ツールのElementを管理するクラス
     *
     * @param {string} name
     * @constructor
     * @public
     */
    constructor (name: string = "")
    {
        super(name);

        /**
         * @type {string}
         * @private
         */
        this._$cursor = "auto";

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$pageX = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$pageY = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$offsetX = 0;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$offsetY = 0;

        if (name) {
            this._$register(name);
        }
    }

    /**
     * @description Toolオブジェクトをマップに登録して、対象のElementにイベントを登録
     *              Register Tool object to map and register event to target Element
     *
     * @param {string} name
     * @method
     * @private
     */
    _$register (name: string)
    {
        // 初期ElementになければPluginとして登録
        const element: HTMLElement | null = document
            .getElementById(`${$TOOL_PREFIX}-${name}`);

        // 対象のElementにイベントを追加
        if (!element || element.dataset.mode !== "tool") {
            return ;
        }

        // Toolオブジェクトをマップに登録
        $registerDefaultTool(this);

        element.addEventListener(EventType.MOUSE_DOWN, (event: PointerEvent): void =>
        {
            toolChangeActiveUseCase(event, this);
        });
    }

    /**
     * @member {number} page_x
     * @return {number}
     * @public
     */
    get pageX (): number
    {
        return this._$pageX;
    }
    set pageX (page_x: number)
    {
        this._$pageX = page_x;
    }

    /**
     * @member {number} page_y
     * @return {number}
     * @public
     */
    get pageY (): number
    {
        return this._$pageY;
    }
    set pageY (page_y: number)
    {
        this._$pageY = page_y;
    }

    /**
     * @member {number} offset_x
     * @return {number}
     * @public
     */
    get offsetX (): number
    {
        return this._$offsetX;
    }
    set offsetX (offset_x: number)
    {
        this._$offsetX = offset_x;
    }

    /**
     * @member {number} offset_y
     * @return {number}
     * @public
     */
    get offsetY (): number
    {
        return this._$offsetY;
    }
    set offsetY (offset_y: number)
    {
        this._$offsetY = offset_y;
    }

    /**
     * @return {string}
     * @readonly
     * @public
     */
    get cursor (): string
    {
        return this._$cursor;
    }

    /**
     * @description 対象のツールElementのアイコンを入れ替える
     *              Replace the icon of the target Tool Element
     *
     * @param  {Element} element
     * @return {void}
     * @method
     * @public
     */
    setIcon (element: HTMLElement): void
    {
        const parent: HTMLElement | null = document
            .getElementById(`${$TOOL_PREFIX}-${this.name}`);

        if (!parent) {
            return ;
        }

        while (parent.children.length) {
            parent.children[0].remove();
        }

        parent.appendChild(element);
    }

    /**
     * @description ツールの簡易説明を登録
     *              Register a brief description of the tool
     *
     * @param  {string} tip
     * @return {void}
     * @method
     * @public
     */
    setToolTip (tip: string): void
    {
        const element: HTMLElement | null = document
            .getElementById(`${$TOOL_PREFIX}-${this.name}`);

        if (!element) {
            return ;
        }

        element.dataset.detail = `${tip}`;
    }

    /**
     * @description マウスオーバー、ムーブ時のカーソルを指定
     *              Designates cursor for mouse over and move
     *
     * @param  {string} [cursor="auto"]
     * @return {void}
     * @method
     * @public
     */
    setCursor (cursor: string = "auto"): void
    {
        this._$cursor = `${cursor}`;
    }
}