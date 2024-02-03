import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { ExternalLibrary } from "@/external/controller/domain/model/ExternalLibrary";

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
export const execute = async <T extends FileSystemEntry>(
    entry: T,
    path: string = ""
): Promise<void> => {

    // 外部APIを起動
    const externalLibrary = new ExternalLibrary($getCurrentWorkSpace());

    // ディレクトリの中のファイルを全てスキャンする
    if (entry instanceof FileSystemDirectoryEntry) {

        const paths: string[] = [];
        if (path) {
            paths.push(path);
        }

        // ディレクトリ名を追加
        paths.push(entry.name);

        const folderPath = paths.join("/");

        // フォルダを作成
        externalLibrary.addNewFolder(folderPath);

        entry
            .createReader()
            .readEntries(async (entries: FileSystemEntry[]): Promise<void> =>
            {
                for (let idx = 0; idx < entries.length; ++idx) {
                    await execute(entries[idx], folderPath);
                }
            });

        return ;
    }

    // ファイルなら読み込む
    if (entry instanceof FileSystemFileEntry) {
        return new Promise((resolve): void =>
        {
            entry
                .file((file: File): void =>
                {
                    externalLibrary
                        .importFile(file, path)
                        .then(resolve);
                });
        });
    }
};