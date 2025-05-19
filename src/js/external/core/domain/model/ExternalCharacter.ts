import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as externalCharacterUpdateXUseCase } from "@/external/core/application/ExternalCharacter/usecase/ExternalCharacterUpdateXUseCase";
import { execute as externalCharacterUpdateYUseCase } from "@/external/core/application/ExternalCharacter/usecase/ExternalCharacterUpdateYUseCase";
import { execute as externalCharacterUpdateScaleXUseCase } from "@/external/core/application/ExternalCharacter/usecase/ExternalCharacterUpdateScaleXUseCase";
import { execute as externalCharacterUpdateScaleYUseCase } from "@/external/core/application/ExternalCharacter/usecase/ExternalCharacterUpdateScaleYUseCase";
import { execute as externalCharacterUpdateNameUseCase } from "@/external/core/application/ExternalCharacter/usecase/ExternalCharacterUpdateNameUseCase";

/**
 * @description DisplayObjectの管理クラス
 *              Management class of DisplayObject
 *
 * @class
 * @public
 */
export class ExternalCharacter
{
    private readonly _$workSpace: WorkSpace;
    private readonly _$movieClip: MovieClip;
    private readonly _$layer: Layer;
    private readonly _$character: Character;

    /**
     * @param {WorkSpace} work_space
     * @param {MovieClip} movie_clip
     * @param {Layer} layer
     * @param {Character} character
     * @constructor
     * @public
     */
    constructor (
        work_space: WorkSpace,
        movie_clip: MovieClip,
        layer: Layer,
        character: Character
    ) {
        /**
         * @type {WorkSpace}
         * @private
         */
        this._$workSpace = work_space;

        /**
         * @type {MovieClip}
         * @private
         */
        this._$movieClip = movie_clip;

        /**
         * @type {Layer}
         * @private
         */
        this._$layer = layer;

        /**
         * @type {Character}
         * @private
         */
        this._$character = character;
    }

    /**
     * @description DisplayObjectのx座標を返却
     *              Returns the x-coordinate of DisplayObject
     *
     * @return {number}
     * @method
     * @public
     */
    getX (): number
    {
        return this._$character.x;
    }

    /**
     * @description DisplayObjectのx座標を設定
     *              Set the x-coordinate of DisplayObject
     *
     * @param  {number} x
     * @return {Promise<void>}
     * @method
     * @public
     */
    async setX (x: number): Promise<void>
    {
        await externalCharacterUpdateXUseCase(
            this._$workSpace,
            this._$movieClip,
            this._$layer,
            this._$character,
            x
        );
    }

    /**
     * @description DisplayObjectのy座標を返却
     *              Returns the y-coordinate of DisplayObject
     *
     * @return {number}
     * @method
     * @public
     */
    getY (): number
    {
        return this._$character.y;
    }

    /**
     * @description DisplayObjectのy座標を設定
     *              Set the y-coordinate of DisplayObject
     *
     * @param  {number} y
     * @return {Promise<void>}
     * @method
     * @public
     */
    async setY (y: number): Promise<void>
    {
        await externalCharacterUpdateYUseCase(
            this._$workSpace,
            this._$movieClip,
            this._$layer,
            this._$character,
            y
        );
    }

    /**
     * @description DisplayObjectのスケールXを返却
     *              Returns the scaleX of DisplayObject
     *
     * @return {number}
     * @method
     * @public
     */
    getScaleX (): number
    {
        return this._$character.scaleX;
    }

    /**
     * @description DisplayObjectのスケールXを設定
     *              Set the scaleX of DisplayObject
     *
     * @param  {number} scale_x
     * @return {Promise<void>}
     * @method
     * @public
     */
    async setScaleX (scale_x: number): Promise<void>
    {
        await externalCharacterUpdateScaleXUseCase(
            this._$workSpace,
            this._$movieClip,
            this._$layer,
            this._$character,
            scale_x
        );
    }

    /**
     * @description DisplayObjectのスケールYを返却
     *              Returns the scaleY of DisplayObject
     *
     * @return {number}
     * @method
     * @public
     */
    getScaleY (): number
    {
        return this._$character.scaleY;
    }

    /**
     * @description DisplayObjectのスケールYを設定
     *              Set the scaleY of DisplayObject
     *
     * @param  {number} scale_y
     * @return {Promise<void>}
     * @method
     * @public
     */
    async setScaleY (scale_y: number): Promise<void>
    {
        await externalCharacterUpdateScaleYUseCase(
            this._$workSpace,
            this._$movieClip,
            this._$layer,
            this._$character,
            scale_y
        );
    }

    /**
     * @description DisplayObjectの名前を返却
     *              Returns the name of DisplayObject
     *
     * @return {string}
     * @default ""
     * @method
     * @public
     */
    getName (): string
    {
        return this._$character.name;
    }

    /**
     * @description DisplayObjectの名前を設定
     *              Set the name of DisplayObject
     *
     * @param  {string} [name=""]
     * @return {Promise<void>}
     * @method
     * @public
     */
    async setName (name: string = ""): Promise<void>
    {
        await externalCharacterUpdateNameUseCase(
            this._$workSpace,
            this._$movieClip,
            this._$layer,
            this._$character,
            name
        );
    }
}