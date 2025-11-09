import type { ILayerSaveObject } from "@/interface/ILayerSaveObject";
import type { ILayerMode } from "@/interface/ILayerMode";
import type { ICharacterSaveObject } from "@/interface/ICharacterSaveObject";
import type { IEmptyCharacterSaveObject } from "@/interface/IEmptyCharacterSaveObject";
import { Character } from "./Character";
import { EmptyCharacter } from "./EmptyCharacter";
import { execute as timelineLayerControllerGetHighlightColorService } from "@/timeline/application/TimelineLayerController/service/TimelineLayerControllerGetHighlightColorService";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $getTopIndex } from "@/timeline/application/TimelineUtil";
import { $NORMAL_MODE } from "@/config/LayerModeConfig";
import { $clamp } from "@/global/GlobalUtil";

/**
 * @description タイムラインのレイヤー状態管理クラス
 *              Timeline layer state management class
 *
 * @class
 * @public
 */
export class Layer
{
    /**
     * @description Layerの識別ID
     *              Layer identification ID
     *
     * @member {number}
     * @public
     */
    public id: number;

    /**
     * @description Layerの表示名
     *              Layer display name
     *
     * @member {string}
     * @public
     */
    public name: string;

    /**
     * @description ハイライトカラーの値
     *              Highlight Color Value
     *
     * @member {string}
     * @public
     */
    public color: string;

    /**
     * @description ハイライトのon/off設定
     *              Highlight on/off setting
     *
     * @default false
     * @member  {boolean}
     * @public
     */
    public light: boolean;

    /**
     * @description 表示/非表示の設定
     *              Show/Hide settings
     *
     * @default false
     * @member {boolean}
     * @public
     */
    public disable: boolean;

    /**
     * @description レイヤーロックのon/off設定
     *              Layer lock on/off setting
     *
     * @default false
     * @member {boolean}
     * @public
     */
    public lock: boolean;

    /**
     * @description レイヤーのモードの値
     *              Layer mode value
     *
     * @default 0
     * @member {number}
     * @public
     */
    public mode: ILayerMode;

    /**
     * @description 入れ子になってる親のレイヤーIndex値
     *              Index value of the parent layer that is nested
     *
     * @default -1
     * @member {number}
     * @public
     */
    public parentId: number;

    /**
     * @description レイヤー内のDisplayObject配列
     *              DisplayObject array in layer
     *
     * @member {array}
     * @readonly
     * @public
     */
    public readonly characters: Character[];

    /**
     * @description レイヤー内の空のキーフレーム配列
     *              Empty keyframe array in layer
     *
     * @member {array}
     * @readonly
     * @public
     */
    public readonly emptyCharacters: EmptyCharacter[];

    /**
     * @param {object} [object = null]
     * @constructor
     * @public
     */
    constructor (object: ILayerSaveObject | null = null)
    {
        this.id              = -1;
        this.name            = "";
        this.color           = "";
        this.light           = false;
        this.disable         = false;
        this.lock            = false;
        this.mode            = 0;
        this.parentId        = -1;
        this.characters      = [];
        this.emptyCharacters = [];

        if (object) {
            this.load(object);
        } else {
            this.color = timelineLayerControllerGetHighlightColorService();
        }
    }

    /**
     * @description レイヤー内の最小フレーム数を返却
     *              Returns the minimum number of frames in the layer
     *
     * @member {number}
     * @readonly
     * @public
     */
    get minFrame (): number
    {
        let minFrame = 1;
        for (let idx = 0; idx < this.characters.length; ++idx) {
            minFrame = Math.min(minFrame, this.characters[idx].startFrame);
        }

        for (let idx = 0; idx < this.emptyCharacters.length; ++idx) {
            minFrame = Math.min(minFrame, this.emptyCharacters[idx].startFrame);
        }

        return minFrame;
    }

    /**
     * @description レイヤー内の最大フレーム数を返却
     *              Returns the maximum number of frames in the layer
     *
     * @member {number}
     * @readonly
     * @public
     */
    get maxFrame (): number
    {
        let maxFrame = 0;
        for (let idx = 0; idx < this.characters.length; ++idx) {
            maxFrame = Math.max(maxFrame, this.characters[idx].endFrame);
        }

        for (let idx = 0; idx < this.emptyCharacters.length; ++idx) {
            maxFrame = Math.max(maxFrame, this.emptyCharacters[idx].endFrame);
        }

        return maxFrame;
    }

    /**
     * @description 現在の表示index値を返却
     *              Return current display index value
     *
     * @return {number}
     * @method
     * @public
     */
    getDisplayIndex (): number
    {
        const scene = $getCurrentWorkSpace().scene;
        const index = scene.layers.indexOf(this);
        return index === -1 ? index : index - $getTopIndex();
    }

    /**
     * @description レイヤーのモードを変更
     *             Change the mode of the layer
     *
     * @return {void}
     * @method
     * @public
     */
    clearRelation (): void
    {
        // ノーマルモードに更新
        this.mode = $NORMAL_MODE;

        // 親のIndexをnullに更新
        this.parentId = -1;
    }

    /**
     * @description 保存データからLayerを復元
     *              Restore Layer from stored data
     *
     * @param  {object} object
     * @return {void}
     * @method
     * @public
     */
    load (object: ILayerSaveObject): void
    {
        this.id      = object.id;
        this.name    = object.name;
        this.color   = object.color;
        this.lock    = object.lock;
        this.disable = object.disable;
        this.light   = object.light;
        this.mode    = object.mode;

        if (object.parentId) {
            this.parentId = object.parentId as number;
        }

        if ("maskId" in object && object.maskId !== null) {
            this.parentId = object.maskId as number;
        }

        if ("guideId" in object && object.guideId !== null) {
            this.parentId = object.guideId as number;
        }

        // 各、キャラクターの読み込み
        this.loadCharacter(object.characters);
        this.loadEmptyCharacter(object.emptyCharacters);
    }

    /**
     * @description セーブデータからキャラクターオブジェクトを複製
     *              Duplicate character objects from saved data
     *
     * @param  {array} characters
     * @return {void}
     * @method
     * @public
     */
    loadCharacter (characters: ICharacterSaveObject[]): void
    {
        if (!characters || !characters.length) {
            return ;
        }

        for (let idx = 0; idx < characters.length; ++idx) {
            const character = new Character();
            character.load(characters[idx]);
            this.addCharacter(character);
        }
    }

    /**
     * @description セーブデータから空のキャラクターオブジェクトを複製
     *              Duplicate empty character objects from saved data
     *
     * @param  {array} empty_characters
     * @return {void}
     * @method
     * @public
     */
    loadEmptyCharacter (empty_characters: IEmptyCharacterSaveObject[]): void
    {
        if (!empty_characters || !empty_characters.length) {
            return ;
        }

        // セーブデータから空のキャラクターオブジェクトを復元
        for (let idx = 0; idx < empty_characters.length; ++idx) {
            const emptyCharacter = new EmptyCharacter();
            emptyCharacter.load(empty_characters[idx]);
            this.addEmptyCharacter(emptyCharacter);
        }
    }

    /**
     * @description ハイライトカラーをセットしたsvgのパスを返す
     *              Returns the path to the svg with highlight color set
     *
     * @return {string}
     * @method
     * @public
     */
    getHighlightURL (): string
    {
        const bigint: number = parseInt(`0x${this.color.slice(1)}`, 16);
        const red: number    = bigint >> 16 & 255;
        const green: number  = bigint >> 8 & 255;
        const blue: number   = bigint & 255;

        return `data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"><path fill="rgb(${red},${green},${blue})" d="M14 19h-4c-.276 0-.5.224-.5.5s.224.5.5.5h4c.276 0 .5-.224.5-.5s-.224-.5-.5-.5zm0 2h-4c-.276 0-.5.224-.5.5s.224.5.5.5h4c.276 0 .5-.224.5-.5s-.224-.5-.5-.5zm.25 2h-4.5l1.188.782c.154.138.38.218.615.218h.895c.234 0 .461-.08.615-.218l1.187-.782zm3.75-13.799c0 3.569-3.214 5.983-3.214 8.799h-1.989c-.003-1.858.87-3.389 1.721-4.867.761-1.325 1.482-2.577 1.482-3.932 0-2.592-2.075-3.772-4.003-3.772-1.925 0-3.997 1.18-3.997 3.772 0 1.355.721 2.607 1.482 3.932.851 1.478 1.725 3.009 1.72 4.867h-1.988c0-2.816-3.214-5.23-3.214-8.799 0-3.723 2.998-5.772 5.997-5.772 3.001 0 6.003 2.051 6.003 5.772zm4-.691v1.372h-2.538c.02-.223.038-.448.038-.681 0-.237-.017-.464-.035-.69h2.535zm-10.648-6.553v-1.957h1.371v1.964c-.242-.022-.484-.035-.726-.035-.215 0-.43.01-.645.028zm-3.743 1.294l-1.04-1.94 1.208-.648 1.037 1.933c-.418.181-.822.401-1.205.655zm10.586 1.735l1.942-1.394.799 1.115-2.054 1.473c-.191-.43-.423-.827-.687-1.194zm-3.01-2.389l1.038-1.934 1.208.648-1.041 1.941c-.382-.254-.786-.473-1.205-.655zm-10.068 3.583l-2.054-1.472.799-1.115 1.942 1.393c-.264.366-.495.763-.687 1.194zm13.707 6.223l2.354.954-.514 1.271-2.425-.982c.21-.397.408-.812.585-1.243zm-13.108 1.155l-2.356 1.06-.562-1.251 2.34-1.052c.173.433.371.845.578 1.243zm-1.178-3.676h-2.538v-1.372h2.535c-.018.226-.035.454-.035.691 0 .233.018.458.038.681z"/></svg>`;
    }

    /**
     * @description 空のキーフレームを追加
     *              Add an empty key frame
     *
     * @param  {EmptyCharacter} empty_character
     * @return {void}
     * @method
     * @public
     */
    addEmptyCharacter (empty_character: EmptyCharacter): void
    {
        this.emptyCharacters.push(empty_character);
    }

    /**
     * @description 空のキーフレームを削除
     *              Remove an empty key frame
     *
     * @param  {EmptyCharacter} empty_character
     * @return {void}
     * @method
     * @public
     */
    removeEmptyCharacter (empty_character: EmptyCharacter): void
    {
        this.emptyCharacters.splice(this.emptyCharacters.indexOf(empty_character), 1);
    }

    /**
     * @description キーフレームを追加
     *              Add an key frame
     *
     * @param  {Character} character
     * @return {void}
     * @method
     * @public
     */
    addCharacter (character: Character): void
    {
        const activeCharacters = this.getActiveCharacters(character.startFrame);
        character.depth = $clamp(character.depth, 0, activeCharacters.length);

        for (let idx = 0; idx < activeCharacters.length; ++idx) {
            const activeCharacter = activeCharacters[idx];
            if (!activeCharacter) {
                continue;
            }

            if (character.depth > activeCharacter.depth) {
                continue;
            }
            activeCharacter.depth++;
        }

        this.characters.push(character);
    }

    /**
     * @description キーフレームを削除
     *              Remove keyframe
     *
     * @param  {Character} character
     * @return {void}
     * @method
     * @public
     */
    removeCharacter (character: Character): void
    {
        this.characters.splice(this.characters.indexOf(character), 1);
        const activeCharacters = this.getActiveCharacters(character.startFrame);

        // DisplayObjectの深度を調整
        for (let idx = 0; idx < activeCharacters.length; ++idx) {
            const activeCharacter = activeCharacters[idx];
            if (!activeCharacter) {
                continue;
            }

            if (character.depth > activeCharacter.depth) {
                continue;
            }
            activeCharacter.depth--;
        }
    }

    /**
     * @description 指定したフレームに空のキーフレームがあれば返却
     *              Returns an empty keyframe at the specified frame
     *
     * @param  {number} frame
     * @return {EmptyCharacter | null}
     * @method
     * @public
     */
    getActiveEmptyCharacter (frame: number): EmptyCharacter | null
    {
        for (let idx = 0; idx < this.emptyCharacters.length; ++idx) {
            const emptyCharacter = this.emptyCharacters[idx];
            if (emptyCharacter.startFrame === frame
                || frame > emptyCharacter.startFrame && frame < emptyCharacter.endFrame
            ) {
                return emptyCharacter;
            }
        }

        return null;
    }

    /**
     * @description 指定したフレームにキーフレームがあれば返却
     *              Returns a keyframe at the specified frame
     *
     * @param  {number} frame
     * @return {EmptyCharacter | null}
     * @method
     * @public
     */
    getActiveCharacters (frame: number): Character[]
    {
        const characters = [];
        for (let idx = 0; idx < this.characters.length; ++idx) {
            const character = this.characters[idx];
            if (character.startFrame === frame
                || frame > character.startFrame && frame < character.endFrame
            ) {
                characters.push(character);
            }
        }

        return characters;
    }

    /**
     * @description 任意のDisplayObjectを返却
     *              Returns any DisplayObject
     *
     * @param  {number} frame
     * @param  {number} depth
     * @return {Character | null}
     * @method
     * @public
     */
    getCharacter (
        frame: number,
        depth: number
    ): Character | null {

        const characters = this.getActiveCharacters(frame);
        for (let idx = 0; idx < characters.length; ++idx) {
            const character = characters[idx];
            if (character.depth !== depth) {
                continue;
            }

            return character;
        }

        return null;
    }

    /**
     * @description セーブオブジェクトに変換
     *              Convert to save object
     *
     * @return {object}
     * @method
     * @public
     */
    toObject (): ILayerSaveObject
    {
        const characters = [];
        for (let idx = 0; idx < this.characters.length; ++idx) {
            const character = this.characters[idx];
            characters.push(character.toObject());
        }

        const emptyCharacters = [];
        for (let idx = 0; idx < this.emptyCharacters.length; ++idx) {
            const emptyCharacter = this.emptyCharacters[idx];
            emptyCharacters.push(emptyCharacter.toObject());
        }

        return {
            "id": this.id,
            "name": this.name,
            "color": this.color,
            "lock": this.lock,
            "disable": this.disable,
            "light": this.light,
            "mode": this.mode,
            "parentId": this.parentId,
            "characters": characters,
            "emptyCharacters": emptyCharacters
        };
    }
}