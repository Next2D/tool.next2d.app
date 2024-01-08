import { ExternalWorkSpace } from "@/external/core/domain/model/ExternalWorkSpace";

/**
 * @description ライブラリの外部APIクラス
 *              External API classes for the library
 *
 * @class
 */
export class ExternalLibrary
{
    private readonly _$externalWorkSpace: ExternalWorkSpace;

    /**
     * @param {ExternalWorkSpace} external_work_space
     * @constructor
     * @public
     */
    constructor (external_work_space: ExternalWorkSpace)
    {
        this._$externalWorkSpace = external_work_space;
    }
}