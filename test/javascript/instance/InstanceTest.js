describe("Instance.js property test", () =>
{
    beforeEach(() =>
    {
        document.body.innerHTML = window.__html__["test/test.html"];
    });

    it("property test", () =>
    {
        const instance = new Instance({
            "id": 1,
            "name": "test_instance",
            "type": InstanceType.BITMAP
        });

        expect(instance.id).toBe(1);
        expect(instance.name).toBe("test_instance");
        expect(instance.type).toBe(InstanceType.BITMAP);
        expect(instance.folderId).toBe(0);
    });

    it("property test", () =>
    {
        const instance = new Instance({
            "id": 1,
            "name": "test_instance",
            "type": InstanceType.BITMAP
        });

        expect(instance.id).toBe(1);
        expect(instance.name).toBe("test_instance");
        expect(instance.type).toBe(InstanceType.BITMAP);
        expect(instance.folderId).toBe(0);
    });

    it("property name and symbol test case1", () =>
    {
        const instance = new Instance({
            "id": 1,
            "name": "test_instance",
            "type": InstanceType.BITMAP,
            "symbol": "app.next2d"
        });

        Util.$libraryController.createInstance(
            instance.type, instance.name, instance.id, instance.symbol
        );

        const nameElement = document
            .getElementById(`library-name-${instance.id}`);

        const symbolElement = document
            .getElementById(`library-symbol-name-${instance.id}`);

        // 変更前
        expect(instance.name).toBe("test_instance");
        expect(instance.symbol).toBe("app.next2d");
        expect(nameElement.textContent).toBe("test_instance");
        expect(symbolElement.textContent).toBe("app.next2d");

        instance.name = "edit_instance_name";
        instance.symbol = "next2d";

        // 変更後
        expect(instance.name).toBe("edit_instance_name");
        expect(instance.symbol).toBe("next2d");
        expect(nameElement.textContent).toBe("edit_instance_name");
        expect(symbolElement.textContent).toBe("next2d");

        // reset
        document
            .getElementById(`library-child-id-${instance.id}`)
            .remove();
    });

    it("property name test case2", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const instance = new MovieClip({
            "id": 1,
            "name": "test_movie_clip",
            "type": InstanceType.MOVIE_CLIP
        });
        workSpaces._$libraries.set(instance.id, instance);

        Util.$libraryController.createInstance(
            instance.type, instance.name, instance.id
        );

        // 変更前
        expect(instance.name).toBe("test_movie_clip");

        workSpaces.scene = instance;

        // 変更後
        instance.name = "update_movie_clip";
        expect(instance.name).toBe("update_movie_clip");

        const element = document
            .getElementById(`library-name-${instance.id}`);
        expect(element.textContent).toBe("update_movie_clip");

        const objectName = document.getElementById("object-name");
        expect(objectName.value).toBe("update_movie_clip");

        const sceneName = document.getElementById("scene-name");
        expect(sceneName.textContent).toBe("update_movie_clip");

        // reset
        document
            .getElementById(`library-child-id-${instance.id}`)
            .remove();
        Util.$workSpaces.length = 0;
    });

    it("property type test", () =>
    {
        const instance = new Instance({
            "id": 1,
            "name": "test_instance",
            "type": InstanceType.BITMAP
        });

        expect(instance.type).toBe(InstanceType.BITMAP);

        instance.type = "ShapE";
        expect(instance.type).toBe(InstanceType.SHAPE);

        instance.type = "BItmap";
        expect(instance.type).toBe(InstanceType.BITMAP);

        instance.type = "VideO";
        expect(instance.type).toBe(InstanceType.VIDEO);

        instance.type = "foldeR";
        expect(instance.type).toBe(InstanceType.FOLDER);

        instance.type = "souNd";
        expect(instance.type).toBe(InstanceType.SOUND);

        instance.type = "cONTaiNEr";
        expect(instance.type).toBe(InstanceType.MOVIE_CLIP);

        instance.type = "TeXT";
        expect(instance.type).toBe(InstanceType.TEXT);

        instance.type = "aaaa";
        expect(instance.type).toBe(InstanceType.TEXT);
    });
});

describe("Instance.js path test", () =>
{
    it("property path test", () =>
    {
        const instance = new Instance({
            "id": 1,
            "name": "test_instance",
            "type": InstanceType.BITMAP
        });

        expect(instance.path).toBe("test_instance");
    });

    it("property path in folder test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const folder1 = new Folder({
            "id": 1,
            "name": "folder_01",
            "type": InstanceType.FOLDER
        });
        workSpaces._$libraries.set(folder1.id, folder1);

        const folder2 = new Folder({
            "id": 2,
            "name": "folder_02",
            "type": InstanceType.FOLDER,
            "folderId": 1
        });
        workSpaces._$libraries.set(folder2.id, folder2);

        const instance = new Instance({
            "id": 3,
            "name": "test_instance",
            "type": InstanceType.BITMAP,
            "folderId": 2
        });
        workSpaces._$libraries.set(instance.id, instance);

        expect(instance.path).toBe("folder_01/folder_02/test_instance");

        // reset
        Util.$workSpaces.length = 0;
    });

    it("property path in workSpaces test", () =>
    {
        const workSpaces1 = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces1);

        const workSpaces2 = new WorkSpace();
        Util.$workSpaces.push(workSpaces2);

        const folder1 = new Folder({
            "id": 1,
            "name": "folder_01",
            "type": InstanceType.FOLDER
        });
        workSpaces1._$libraries.set(folder1.id, folder1);

        const folder2 = new Folder({
            "id": 2,
            "name": "folder_02",
            "type": InstanceType.FOLDER,
            "folderId": 1
        });
        workSpaces1._$libraries.set(folder2.id, folder2);

        const instance1 = new Instance({
            "id": 3,
            "name": "test_instance",
            "type": InstanceType.BITMAP,
            "folderId": 2
        });
        workSpaces1._$libraries.set(instance1.id, instance1);

        const folder3 = new Folder({
            "id": 1,
            "name": "folder_03",
            "type": InstanceType.FOLDER
        });
        workSpaces2._$libraries.set(folder3.id, folder3);

        const instance2 = new Instance({
            "id": 2,
            "name": "test_instance2",
            "type": InstanceType.BITMAP,
            "folderId": 1
        });
        workSpaces2._$libraries.set(instance2.id, instance2);

        expect(instance1.path).toBe("folder_01/folder_02/test_instance");
        expect(instance2.getPathWithWorkSpace(workSpaces2))
            .toBe("folder_03/test_instance2");

        // reset
        Util.$workSpaces.length = 0;
    });
});

describe("Instance.js function test", () =>
{
    beforeEach(() =>
    {
        document.body.innerHTML = window.__html__["test/test.html"];
    });

    it("property remove test case1", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const movieClip = new MovieClip({
            "id": 1,
            "name": "test_movie_clip",
            "type": InstanceType.MOVIE_CLIP
        });
        workSpaces._$libraries.set(movieClip.id, movieClip);

        const bitmap = new Instance({
            "id": 2,
            "name": "test_bitmap",
            "type": InstanceType.BITMAP
        });
        workSpaces._$libraries.set(bitmap.id, bitmap);

        // シーンをセット
        const parent = workSpaces._$libraries.get(0);
        workSpaces.scene = parent;

        // 削除するMovieClipにBitmapを設置
        const character = new Character();
        character.libraryId = bitmap.id;
        // キーフレームを登録
        character.setPlace(1, {
            "frame": 1,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0
        });

        expect(movieClip._$layers.size).toBe(0);
        const layer = new Layer();
        movieClip.addLayer(layer);
        expect(movieClip._$layers.size).toBe(1);

        expect(layer._$characters.length).toBe(0);
        layer.addCharacter(character);
        expect(layer._$characters.length).toBe(1);

        // rootのMovieClipに設置
        const parentCharacter1 = new Character();
        parentCharacter1.libraryId = movieClip.id;

        // キーフレームを登録
        parentCharacter1.setPlace(1, {
            "frame": 1,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0
        });

        const parentCharacter2 = new Character();
        parentCharacter2.libraryId = movieClip.id;

        // キーフレームを登録
        parentCharacter2.setPlace(1, {
            "frame": 1,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0
        });

        expect(parent._$layers.size).toBe(1);
        const parentLayer = new Layer();
        parent.addLayer(parentLayer);
        expect(parent._$layers.size).toBe(2);

        expect(parentLayer._$characters.length).toBe(0);
        parentLayer.addCharacter(parentCharacter1);
        parentLayer.addCharacter(parentCharacter2);
        expect(parentLayer._$characters.length).toBe(2);
        expect(parentLayer._$emptys.length).toBe(0);

        // ライブラリの設置数
        expect(workSpaces._$libraries.size).toBe(3);

        // 空のキーフレーム数を確認
        expect(layer._$emptys.length).toBe(0);

        // 関数を実行
        movieClip.remove();
        expect(parentLayer._$characters.length).toBe(0);
        expect(parentLayer._$emptys.length).toBe(1);
        expect(workSpaces._$libraries.size).toBe(3);

        // reset
        Util.$workSpaces.length = 0;
    });

    it("property remove test case2", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const movieClip = new MovieClip({
            "id": 1,
            "name": "test_movie_clip",
            "type": InstanceType.MOVIE_CLIP
        });
        workSpaces._$libraries.set(movieClip.id, movieClip);

        const bitmap = new Instance({
            "id": 2,
            "name": "test_bitmap",
            "type": InstanceType.BITMAP
        });
        workSpaces._$libraries.set(bitmap.id, bitmap);

        // シーンをセット
        const parent = workSpaces._$libraries.get(0);
        workSpaces.scene = parent;

        // 削除するMovieClipにBitmapを設置
        const character = new Character();
        character.libraryId = bitmap.id;
        // キーフレームを登録
        character.setPlace(1, {
            "frame": 1,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0
        });

        expect(movieClip._$layers.size).toBe(0);
        const layer = new Layer();
        movieClip.addLayer(layer);
        expect(movieClip._$layers.size).toBe(1);

        expect(layer._$characters.length).toBe(0);
        layer.addCharacter(character);
        expect(layer._$characters.length).toBe(1);

        // rootのMovieClipに設置
        const parentCharacter1 = new Character();
        parentCharacter1.libraryId = movieClip.id;

        // キーフレームを登録
        parentCharacter1.setPlace(1, {
            "frame": 1,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0
        });

        const parentCharacter2 = new Character();
        parentCharacter2.libraryId = bitmap.id;

        // キーフレームを登録
        parentCharacter2.setPlace(1, {
            "frame": 1,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0
        });

        expect(parent._$layers.size).toBe(1);
        const parentLayer = new Layer();
        parent.addLayer(parentLayer);
        expect(parent._$layers.size).toBe(2);

        expect(parentLayer._$characters.length).toBe(0);
        parentLayer.addCharacter(parentCharacter1);
        parentLayer.addCharacter(parentCharacter2);
        expect(parentLayer._$characters.length).toBe(2);
        expect(parentLayer._$emptys.length).toBe(0);

        // ライブラリの設置数
        expect(workSpaces._$libraries.size).toBe(3);

        // 空のキーフレーム数を確認
        expect(layer._$emptys.length).toBe(0);

        // 関数を実行
        movieClip.remove();
        expect(parentLayer._$characters.length).toBe(1);
        expect(parentLayer._$emptys.length).toBe(0);
        expect(workSpaces._$libraries.size).toBe(3);

        // reset
        Util.$workSpaces.length = 0;
    });
});
