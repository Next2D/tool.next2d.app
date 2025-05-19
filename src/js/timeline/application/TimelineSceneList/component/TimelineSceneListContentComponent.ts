import type { Instance } from "@/core/domain/model/Instance";

/**
 * @description タイムラインのシーン名一覧のElementをstringで返却
 *              Element of the list of scene names in the timeline is returned as a string
 *
 * @params {Instance} instance
 * @return {string}
 * @method
 * @public
 */
export const execute = <I extends Instance> (instance: I): string =>
{
    return `<div id="scene-library-id-${instance.id}" data-library-id="${instance.id}">${instance.name}</div>`;
};