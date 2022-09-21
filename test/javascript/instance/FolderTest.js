describe("Folder.js property test", () =>
{
    it("property test", () =>
    {
        const folder = new Folder({
            "id": 0,
            "name": "",
            "type": InstanceType.FOLDER
        });
        expect(folder.mode).toBe(FolderType.CLOSE);

        folder.mode = "Open";
        expect(folder.mode).toBe(FolderType.OPEN);

        folder.mode = "aaa";
        expect(folder.mode).toBe(FolderType.CLOSE);
    });
});

describe("Folder.js function test", () =>
{
    it("remove test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const folder = new Folder({
            "id": 1,
            "name": "",
            "type": InstanceType.FOLDER
        });
        workSpaces._$libraries.set(folder.id, folder);

        const bitmap1 = new Bitmap({
            "id": 2,
            "imageType": "image/png",
            "width": 200,
            "height": 100,
            "folderId": 1
        });
        workSpaces._$libraries.set(bitmap1.id, bitmap1);

        const bitmap2 = new Bitmap({
            "id": 3,
            "imageType": "image/png",
            "width": 200,
            "height": 100,
            "folderId": 10
        });
        workSpaces._$libraries.set(bitmap2.id, bitmap2);

        expect(workSpaces._$libraries.size).toBe(4);

        // フォルダ内を削除
        folder.remove();

        expect(workSpaces._$libraries.size).toBe(3);

        // フォルダのアイテムは残った状態
        expect(workSpaces._$libraries.get(folder.id) === folder).toBe(true);

        // フォルダ内にある、bitmap1は削除されてる
        expect(workSpaces._$libraries.has(bitmap1.id)).toBe(false);

        // 別フォルダに関連してるアイテムは残った状態
        expect(workSpaces._$libraries.get(bitmap2.id) === bitmap2).toBe(true);

        // reset
        Util.$workSpaces.length = 0;
    });

    it("toObject test", () =>
    {
        const folder = new Folder({
            "id": 1,
            "name": "folder_01",
            "type": InstanceType.FOLDER
        });

        const object = folder.toObject();
        expect(folder.id).toBe(1);
        expect(object.name).toBe("folder_01");
        expect(object.type).toBe(InstanceType.FOLDER);
        expect(object.mode).toBe(FolderType.CLOSE);
    });

    it("getInstanceIds test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const folder1 = new Folder({
            "id": 1,
            "name": "",
            "type": InstanceType.FOLDER
        });
        workSpaces._$libraries.set(folder1.id, folder1);

        const bitmap1 = new Bitmap({
            "id": 2,
            "imageType": "image/png",
            "width": 200,
            "height": 100,
            "folderId": 1
        });
        workSpaces._$libraries.set(bitmap1.id, bitmap1);

        const folder2 = new Folder({
            "id": 10,
            "name": "",
            "type": InstanceType.FOLDER,
            "folderId": 1
        });
        workSpaces._$libraries.set(folder2.id, folder2);

        const bitmap2 = new Bitmap({
            "id": 3,
            "imageType": "image/png",
            "width": 200,
            "height": 100,
            "folderId": 10
        });
        workSpaces._$libraries.set(bitmap2.id, bitmap2);

        expect(workSpaces._$libraries.size).toBe(5);

        const instanceIds = [];
        folder1.getInstanceIds(instanceIds);

        expect(instanceIds.length).toBe(2);
        expect(instanceIds[0]).toBe(2);
        expect(instanceIds[1]).toBe(3);
        expect(workSpaces._$libraries.get(instanceIds[0]) === bitmap1).toBe(true);
        expect(workSpaces._$libraries.get(instanceIds[1]) === bitmap2).toBe(true);

        // reset
        Util.$workSpaces.length = 0;
    });
});
