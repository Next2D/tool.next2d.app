describe("Instance.js property test", () =>
{
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
