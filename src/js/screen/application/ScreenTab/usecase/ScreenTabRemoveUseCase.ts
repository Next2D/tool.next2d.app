import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import { $replace } from "@/language/application/LanguageUtil";

/**
 * @description タブの終了実行のユースケース
 *              Use Case for Exit Tab Execution
 *
 * @params {WorkSpace} work_space
 * @return {void}
 * @method
 * @public
 */
export const execute = async (work_space: WorkSpace): Promise<void> =>
{
    const message: string = $replace(
        "{{プロジェクトが保存されていない場合、" +
        "このタブのプロジェクトデータを復旧する事はできません。" +
        "タブを削除しますか？}}"
    );

    // 削除前に警告を表示
    if (!window.confirm(message)) {
        return ;
    }

    // プロジェクトを終了
    work_space.remove();
};