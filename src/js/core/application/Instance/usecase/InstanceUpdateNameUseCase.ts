import type { Instance } from "@/core/domain/model/Instance";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import { $MOVIE_CLIP_TYPE } from "@/config/InstanceConfig";
import { execute as libraryAreaReloadUseCase } from "@/controller/application/LibraryArea/usecase/LibraryAreaReloadUseCase";
import { execute as timelineToolUpdateSceneNameService } from "@/timeline/application/TimelineTool/application/SceneName/service/TimelineToolUpdateSceneNameService";
import { execute as timelineToolUpdateSceneListNameService } from "@/timeline/application/TimelineTool/application/SceneName/service/TimelineToolUpdateSceneListNameService";
import { execute as objectSettingUpdateNameService } from "@/controller/application/ObjectSetting/service/ObjectSettingUpdateNameService";

/**
 * @description ライブラリのアイテム名を変更した際の表示更新処理
 *              Display update process when changing the item name in the library
 *
 * @param {Instance} instance
 * @return {void}
 * @method
 * @public
 */
export const execute = <I extends Instance> (instance: I): void =>
{
    // ライブラリの表示を再描画
    libraryAreaReloadUseCase();

    // MovieClipの場合はタイムラインの表示情報を更新
    if (instance.type !== $MOVIE_CLIP_TYPE) {
        return ;
    }

    // スクリーン一覧にあれば名前を更新
    timelineToolUpdateSceneListNameService(instance.id, instance.name);

    // アクティブなら表示を更新
    if ((instance as unknown as MovieClip).active) {
        // タイムラインの表示を更新
        timelineToolUpdateSceneNameService(instance.name);

        // プロパティの表示を更新
        // TODO スクリーンエリアの未選択の判定を追加
        objectSettingUpdateNameService(instance.name);
    }
};