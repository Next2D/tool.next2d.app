import type { Character } from "@/core/domain/model/Character";
import type { Layer } from "@/core/domain/model/Layer";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { execute as externalCharacterUpdateXUseCase } from "@/external/core/application/ExternalCharacter/usecase/ExternalCharacterUpdateXUseCase";
import { execute as externalCharacterUpdateYUseCase } from "@/external/core/application/ExternalCharacter/usecase/ExternalCharacterUpdateYUseCase";

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
     * @description DisplayObjectのx座標
     *              x-coordinate of DisplayObject
     *
     * @member {number}
     * @public
     */
    get x (): number
    {
        return this._$character.x;
    }
    set x (x: number)
    {
        externalCharacterUpdateXUseCase(
            this._$workSpace,
            this._$movieClip,
            this._$layer,
            this._$character,
            x
        );
    }

    /**
     * @description DisplayObjectのy座標
     *              y-coordinate of DisplayObject
     *
     * @member {number}
     * @public
     */
    get y (): number
    {
        return this._$character.y;
    }
    set y (y: number)
    {
        externalCharacterUpdateYUseCase(
            this._$workSpace,
            this._$movieClip,
            this._$layer,
            this._$character,
            y
        );
    }
}