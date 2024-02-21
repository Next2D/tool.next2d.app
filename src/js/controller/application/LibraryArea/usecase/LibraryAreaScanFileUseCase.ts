import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalLibrary } from "@/external/controller/domain/model/ExternalLibrary";
import { execute as confirmModalDuplicateCheckService } from "@/menu/application/ConfirmModal/service/ConfirmModalDuplicateCheckService";

/**
 * @description ディレクトリの場合はフォルダファイルを作成してディレクトリ内のデータを読み込み
 *              ファイルの場合はファイルタイプに合わせて読み込み
 *              For directories, create a folder file and read the data in the directory
 *              For files, load according to file type
 *
 * @param  {FileSystemEntry} entry
 * @param  {string} [path = ""]
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (
    entry: any,
    path: string = ""
): Promise<void> => {

    // 外部APIを起動
    const workSpace = $getCurrentWorkSpace();
    const externalLibrary = new ExternalLibrary(workSpace);

    // ディレクトリの中のファイルを全てスキャンする
    if (entry.isDirectory) {

        return new Promise((resolve): void =>
        {
            const paths: string[] = [];
            if (path) {
                paths.push(path);
            }

            // ディレクトリ名を追加
            paths.push(entry.name);

            const folderPath = paths.join("/");

            // フォルダを作成
            externalLibrary.addNewFolder(folderPath, false);

            (entry as FileSystemDirectoryEntry)
                .createReader()
                .readEntries(async (entries: FileSystemEntry[]): Promise<void> =>
                {
                    for (let idx = 0; idx < entries.length; ++idx) {
                        await execute(entries[idx], folderPath);
                    }

                    resolve();
                });
        });
    }

    // ファイルなら読み込む
    return new Promise((resolve): void =>
    {
        (entry as FileSystemFileEntry)
            .file((file: File): void =>
            {
                // 重複していればスキップ
                if (confirmModalDuplicateCheckService(workSpace, file, path)) {
                    return resolve();
                }

                const names = file.name.split(".");
                names.pop();
                const name = names.join(".");

                externalLibrary
                    .importFile(file, name, path, false)
                    .then(resolve);
            });
    });
};