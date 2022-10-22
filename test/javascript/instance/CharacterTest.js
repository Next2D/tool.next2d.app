describe("Character.js property test", () =>
{
    it("property test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const character = new Character();

        // 初期値
        expect(character.id).toBe(workSpaces._$characterId - 1);
        expect(character.startFrame).toBe(1);
        expect(character.endFrame).toBe(2);

        Util.$workSpaces.length = 0;
    });

    it("property screenX and screenY test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const character = new Character();

        // 初期値
        expect(character.screenX).toBe(0);
        expect(character.screenY).toBe(0);

        character.screenX = 100.55;
        character.screenY = 99.55;
        expect(character.screenX).toBe(100.55);
        expect(character.screenY).toBe(99.55);

        character.screenX = -60.55;
        character.screenY = -99.55;
        expect(character.screenX).toBe(-60.55);
        expect(character.screenY).toBe(-99.55);

        character.screenX = "abc";
        character.screenY = "abc";
        expect(character.screenX).toBe(0);
        expect(character.screenY).toBe(0);

        Util.$workSpaces.length = 0;
    });

    it("property libraryId test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const character = new Character();

        // 初期値
        expect(character.libraryId).toBe(-1);

        character.libraryId = "abc";
        expect( character.libraryId).toBe(0);

        character.libraryId = 999;
        expect(character.libraryId).toBe(999);

        Util.$workSpaces.length = 0;
    });

    it("property name test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const character = new Character();

        // 初期値
        expect(character.name).toBe("");

        character.name = 12345;
        expect(character.name).toBe("12345");

        character.name = " abc _ 1";
        expect(character.name).toBe("abc_1");

        Util.$workSpaces.length = 0;
    });

    it("property referencePoint test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const character = new Character();

        // 初期値
        expect(character.referencePoint.x).toBe(0);
        expect(character.referencePoint.y).toBe(0);

        character.referencePoint = {
            "x": 100,
            "y": 987
        };
        expect(character.referencePoint.x).toBe(100);
        expect(character.referencePoint.y).toBe(987);

        character.referencePoint = {
            "x": "abc",
            "y": "xyz"
        };
        expect(character.referencePoint.x).toBe(0);
        expect(character.referencePoint.y).toBe(0);

        Util.$workSpaces.length = 0;
    });

    it("property startFrame and endFrame test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const character = new Character();

        // 初期値
        expect(character.startFrame).toBe(1);
        expect(character.endFrame).toBe(2);

        // 正常値をセット
        character.startFrame = 10;
        character.endFrame = 20;
        expect(character.startFrame).toBe(10);
        expect(character.endFrame).toBe(20);

        // 異常値をセット
        character.startFrame = -10;
        character.endFrame = -20;
        expect(character.startFrame).toBe(1);
        expect(character.endFrame).toBe(2);

        // 正常値をセット
        character.startFrame = 10;
        character.endFrame = 20;
        expect(character.startFrame).toBe(10);
        expect(character.endFrame).toBe(20);

        // 異常値をセット
        character.startFrame = "abc";
        character.endFrame = "xyz";
        expect(character.startFrame).toBe(1);
        expect(character.endFrame).toBe(2);

        Util.$workSpaces.length = 0;
    });
});

describe("Character.js function test", () =>
{
    it("function clone test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const character = new Character();
        character.name = "origin";
        expect(character.name).toBe("origin");

        const clone = character.clone();
        character.name = "clone";
        expect(character.name).toBe("clone");

        expect(character.id === clone.id).toBe(false);
        expect(character.name === clone.name).toBe(false);

        Util.$workSpaces.length = 0;
    });

    it("function getPlace and hasPlace and deletePlace test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const character = new Character();
        expect(character._$places.size).toBe(0);

        const place = {
            "frame": 10
        };

        expect(place.frame).toBe(10);
        character.setPlace(1, place);
        expect(place.frame).toBe(1);
        expect(character._$places.size).toBe(1);

        expect(character.hasPlace(1)).toBe(true);
        expect(character.hasPlace("abc")).toBe(false);

        character.deletePlace("abc");
        expect(character._$places.size).toBe(1);

        character.deletePlace("1");
        expect(character._$places.size).toBe(0);

        Util.$workSpaces.length = 0;
    });

    it("function getTween and hasTween and deleteTween test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const character = new Character();
        expect(character._$tween.size).toBe(0);

        const tween = {};

        character.setTween(1, tween);
        expect(character._$tween.size).toBe(1);

        expect(character.hasTween(1)).toBe(true);
        expect(character.hasTween("abc")).toBe(false);

        character.deleteTween("abc");
        expect(character._$tween.size).toBe(1);

        character.deleteTween("1");
        expect(character._$tween.size).toBe(0);

        Util.$workSpaces.length = 0;
    });

    it("function getTween and hasTween and deleteTween test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const character = new Character();
        character._$context = "test";
        expect(character._$context).toBe("test");

        character.dispose();
        expect(character._$context).toBe(null);

        Util.$workSpaces.length = 0;
    });

    it("function getBounds test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const bitmap = new Bitmap({
            "id": 1,
            "name": "image",
            "type": InstanceType.BITMAP,
            "imageType": "image/png",
            "width": 200,
            "height": 100
        });
        workSpaces._$libraries.set(bitmap.id, bitmap);

        const character = new Character();
        character.libraryId = 1;
        character.setPlace(1, {
            "frame": 1,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0
        });

        const bounds = character.getBounds();
        expect(bounds.xMin).toBe(0);
        expect(bounds.xMax).toBe(200);
        expect(bounds.yMin).toBe(0);
        expect(bounds.yMax).toBe(100);

        Util.$workSpaces.length = 0;
    });

});

describe("Character.js showController test", () =>
{
    beforeEach(() =>
    {
        document.body.innerHTML = window.__html__["test/test.html"];
    });

    it("function showController test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const bitmap = new Bitmap({
            "id": 1,
            "name": "image",
            "type": InstanceType.BITMAP,
            "imageType": "image/png",
            "width": 200,
            "height": 100,
            "buffer": new Uint8Array([
                1,2,3,4,5,6,7,8,9,8,7,6,5,4,3,2,1
            ])
        });
        workSpaces._$libraries.set(bitmap.id, bitmap);

        const character = new Character();
        character.libraryId = 1;
        character.setPlace(1, {
            "frame": 1,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0
        });

        character.setTween(1, {
            "method": "linear",
            "curve": [],
            "custom": Util.$tweenController.createEasingObject(),
            "startFrame": 1,
            "endFrame": 2
        });

        Util.$timelineFrame.currentFrame = 1;
        character.showController();

        expect(document.getElementById("sound-setting").style.display).toBe("none");
        expect(document.getElementById("ease-setting").style.display).toBe("");
        expect(document.getElementById("text-setting").style.display).toBe("none");
        expect(document.getElementById("loop-setting").style.display).toBe("none");
        expect(document.getElementById("video-setting").style.display).toBe("none");
        expect(document.getElementById("fill-color-setting").style.display).toBe("none");
        expect(document.getElementById("nine-slice-setting").style.display).toBe("none");
        expect(document.getElementById("object-setting").style.display).toBe("");
        expect(document.getElementById("reference-setting").style.display).toBe("");
        expect(document.getElementById("transform-setting").style.display).toBe("");
        expect(document.getElementById("color-setting").style.display).toBe("");
        expect(document.getElementById("blend-setting").style.display).toBe("");
        expect(document.getElementById("filter-setting").style.display).toBe("");
        expect(document.getElementById("instance-setting").style.display).toBe("");

        Util.$workSpaces.length = 0;
    });
});

describe("Character.js showController test", () =>
{
    beforeEach(() =>
    {
        document.body.innerHTML = window.__html__["test/test.html"];
    });

    it("function showController test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const shape = new Shape({
            "id": 1,
            "name": "Shape_01",
            "type": InstanceType.SHAPE,
            "bounds": {
                "xMin": 0,
                "xMax": 100,
                "yMin": 0,
                "yMax": 200
            }
        });
        workSpaces._$libraries.set(shape.id, shape);

        const character = new Character();
        character.libraryId = 1;
        character.setPlace(1, {
            "frame": 1,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0
        });

        // 表示されてる状態に更新
        Util.$timelineFrame.currentFrame = 1;
        character.showController();

        document.getElementById("fill-color-setting").style.display = "none";
        document.getElementById("nine-slice-setting").style.display = "none";

        // ヒットしない状態のテスト
        character.showShapeColor({
            "offsetX": 0,
            "offsetY": 0
        });

        expect(document.getElementById("fill-color-setting").style.display).toBe("none");
        expect(document.getElementById("nine-slice-setting").style.display).toBe("none");

        // 強制ヒット処理
        shape.setHitColor = () => { Util.$hitColor = true };

        // ヒットした場合のテスト
        character.showShapeColor({
            "offsetX": 0,
            "offsetY": 0
        });

        expect(document.getElementById("fill-color-setting").style.display).toBe("");
        expect(document.getElementById("nine-slice-setting").style.display).toBe("");

        delete shape.setHitColor;
        Util.$workSpaces.length = 0;
    });
});
