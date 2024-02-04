import type { WorkSpace } from "@/core/domain/model/WorkSpace";

/**
 * @description ライブラリのアイテムを名前順に並び替える。フォルダ内はフォルダ内で名前順に並び替える
 *              Sort library items by name. Within a folder, sort by name within the folder.
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (work_space: WorkSpace): void =>
{
    // 全てのインスタンの名前を昇順で並び替え
    const names: string[] = Array.from(work_space.pathMap.keys());
    names.sort();

    // 名前順にインスタンスを配列に格納
    const instances = [];
    for (let idx: number = 0; idx < names.length; ++idx) {

        const name = names[idx];
        if (!work_space.pathMap.has(name)) {
            continue;
        }

        const id = work_space.pathMap.get(name) as NonNullable<number>;
        const instance = work_space.getLibrary(id);
        instances.push(instance);
    }

    // 初期化
    work_space.libraries.clear();
    for (let idx = 0; idx < instances.length; ++idx) {
        const instance = instances[idx];
        work_space.libraries.set(instance.id, instance);
    }

    // マッピングも初期化
    work_space.pathMap.clear();
    for (let idx = 0; idx < instances.length; ++idx) {
        const instance = instances[idx];
        work_space.pathMap.set(names[idx], instance.id);
    }
};