describe("MovieClip.js property test", () =>
{
    it("property test", () =>
    {
        const movieClip = new MovieClip({
            "id": 1,
            "name": "MovieClip_01",
            "type": InstanceType.MOVIE_CLIP
        });

        // mock
        window.next2d = {
            "display": {
                "MovieClip": {
                    "namespace": "next2d.display.MovieClip"
                }
            }
        };

        expect(movieClip.currentFrame).toBe(1);
        expect(movieClip.totalFrame).toBe(1);
        expect(movieClip._$layerId).toBe(0);
        expect(movieClip.layers.length).toBe(0);
        expect(movieClip.labels.length).toBe(0);
        expect(movieClip.sounds.length).toBe(0);
        expect(movieClip.actions.length).toBe(0);
        expect(movieClip.defaultSymbol).toBe("next2d.display.MovieClip");
    });

    it("property totalFrame test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const movieClip = new MovieClip({
            "id": 1,
            "name": "MovieClip_01",
            "type": InstanceType.MOVIE_CLIP
        });
        expect(movieClip.totalFrame).toBe(1);

        const layer = new Layer();
        movieClip.setLayer(layer.id, layer);

        const character1 = new Character();
        character1.libraryId = 2;
        character1.startFrame = 1;
        character1.endFrame   = 5;
        character1.setPlace(1, {
            "frame": 1,
            "matrix": [6, 5, 4, 3, 2, 1],
            "colorTransform": [8, 7, 6, 5, 4, 3, 2, 1],
            "blendMode": "normal",
            "filter": [],
            "depth": 0
        });
        layer.addCharacter(character1);

        expect(movieClip.totalFrame).toBe(4);

        Util.$workSpaces.length = 0;
    });
});

describe("MovieClip.js common function test", () =>
{
    it("function getBounds test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const movieClip = new MovieClip({
            "id": 1,
            "name": "MovieClip_01",
            "type": InstanceType.MOVIE_CLIP
        });
        workSpaces._$libraries.set(movieClip.id, movieClip);

        const bitmap1 = new Bitmap({
            "id": 2,
            "width": 200,
            "height": 100
        });
        workSpaces._$libraries.set(bitmap1.id, bitmap1);

        const layer = new Layer();
        movieClip.setLayer(layer.id, layer);

        const character1 = new Character();
        character1.libraryId = bitmap1.id;
        character1.startFrame = 1;
        character1.endFrame   = 2;
        character1.setPlace(1, {
            "frame": 1,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0
        });
        layer.addCharacter(character1);

        const bounds1 = movieClip.getBounds();
        expect(bounds1.xMax).toBe(200);
        expect(bounds1.yMax).toBe(100);

        const bitmap2 = new Bitmap({
            "id": 3,
            "width": 100,
            "height": 200
        });
        workSpaces._$libraries.set(bitmap2.id, bitmap2);

        const character2 = new Character();
        character2.libraryId = bitmap2.id;
        character2.startFrame = 1;
        character2.endFrame   = 2;
        character2.setPlace(1, {
            "frame": 1,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0
        });
        layer.addCharacter(character2);

        const bounds2 = movieClip.getBounds();
        expect(bounds2.xMax).toBe(200);
        expect(bounds2.yMax).toBe(200);

        Util.$workSpaces.length = 0;
    });

    it("function toObject test", () =>
    {
        const movieClip = new MovieClip({
            "id": 1,
            "name": "MovieClip_01",
            "type": InstanceType.MOVIE_CLIP,
            "symbol": "app.movie.clip"
        });

        const object = movieClip.toObject();
        expect(object.id).toBe(1);
        expect(object.name).toBe("MovieClip_01");
        expect(object.type).toBe(InstanceType.MOVIE_CLIP);
        expect(object.symbol).toBe("app.movie.clip");
        expect(object.folderId).toBe(0);
        expect(object.currentFrame).toBe(1);
        expect(object.layers.length).toBe(0);
        expect(object.labels.length).toBe(0);
        expect(object.sounds.length).toBe(0);
        expect(object.actions.length).toBe(0);
    });

    it("function toPublish test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const movieClip = new MovieClip({
            "id": 1,
            "name": "MovieClip_01",
            "type": InstanceType.MOVIE_CLIP,
            "symbol": "app.movie.clip"
        });
        workSpaces._$libraries.set(movieClip.id, movieClip);

        const bitmap1 = new Bitmap({
            "id": 2,
            "name": "bitmap1",
            "width": 200,
            "height": 100
        });
        workSpaces._$libraries.set(bitmap1.id, bitmap1);

        const layer = new Layer();
        movieClip.setLayer(layer.id, layer);

        const character1 = new Character();
        character1.libraryId = bitmap1.id;
        character1.startFrame = 1;
        character1.endFrame   = 2;
        character1.setPlace(1, {
            "frame": 1,
            "matrix": [6, 5, 4, 3, 2, 1],
            "colorTransform": [8, 7, 6, 5, 4, 3, 2, 1],
            "blendMode": "normal",
            "filter": [],
            "depth": 0
        });
        layer.addCharacter(character1);

        const bitmap2 = new Bitmap({
            "id": 3,
            "name": "bitmap2",
            "width": 100,
            "height": 200
        });
        workSpaces._$libraries.set(bitmap2.id, bitmap2);

        const character2 = new Character();
        character2.libraryId = bitmap2.id;
        character2.startFrame = 1;
        character2.endFrame   = 2;
        character2.setPlace(1, {
            "frame": 1,
            "matrix": [1, 2, 3, 4, 5, 6],
            "colorTransform": [1, 2, 3, 4, 5, 6, 7, 8],
            "blendMode": "normal",
            "filter": [],
            "depth": 1
        });
        layer.addCharacter(character2);

        // mock
        window.next2d = {
            "display": {
                "MovieClip": {
                    "namespace": "next2d.display.MovieClip"
                }
            }
        };

        const object = movieClip.toPublish();
        expect(object.actions).toBe(undefined);
        expect(object.symbol).toBe("app.movie.clip");
        expect(object.extends).toBe("next2d.display.MovieClip");
        expect(object.totalFrame).toBe(1);
        expect(object.labels).toBe(undefined);
        expect(object.sounds).toBe(undefined);
        expect(object.controller.length).toBe(2);
        expect(object.placeMap.length).toBe(2);
        expect(object.placeObjects.length).toBe(2);

        // frameの0はundefined
        expect(object.controller[0]).toBe(undefined);
        expect(object.placeMap[0]).toBe(undefined);

        expect(object.controller[1].length).toBe(2);
        expect(object.controller[1][0]).toBe(0);
        expect(object.controller[1][1]).toBe(1);
        expect(object.placeMap[1].length).toBe(2);
        expect(object.placeMap[1][0]).toBe(0);
        expect(object.placeMap[1][1]).toBe(1);

        const place1 = object.placeObjects[0];
        expect(place1.matrix.length).toBe(6);
        expect(place1.matrix[0]).toBe(6);
        expect(place1.matrix[1]).toBe(5);
        expect(place1.matrix[2]).toBe(4);
        expect(place1.matrix[3]).toBe(3);
        expect(place1.matrix[4]).toBe(2);
        expect(place1.matrix[5]).toBe(1);
        expect(place1.colorTransform.length).toBe(8);
        expect(place1.colorTransform[0]).toBe(8);
        expect(place1.colorTransform[1]).toBe(7);
        expect(place1.colorTransform[2]).toBe(6);
        expect(place1.colorTransform[3]).toBe(5);
        expect(place1.colorTransform[4]).toBe(4);
        expect(place1.colorTransform[5]).toBe(3);
        expect(place1.colorTransform[6]).toBe(2);
        expect(place1.colorTransform[7]).toBe(1);
        expect(place1.blendMode).toBe(undefined);
        expect(place1.surfaceFilterList).toBe(undefined);

        const place2 = object.placeObjects[1];
        expect(place2.matrix.length).toBe(6);
        expect(place2.matrix[0]).toBe(1);
        expect(place2.matrix[1]).toBe(2);
        expect(place2.matrix[2]).toBe(3);
        expect(place2.matrix[3]).toBe(4);
        expect(place2.matrix[4]).toBe(5);
        expect(place2.matrix[5]).toBe(6);
        expect(place2.colorTransform.length).toBe(8);
        expect(place2.colorTransform[0]).toBe(1);
        expect(place2.colorTransform[1]).toBe(2);
        expect(place2.colorTransform[2]).toBe(3);
        expect(place2.colorTransform[3]).toBe(4);
        expect(place2.colorTransform[4]).toBe(5);
        expect(place2.colorTransform[5]).toBe(6);
        expect(place2.colorTransform[6]).toBe(7);
        expect(place2.colorTransform[7]).toBe(8);
        expect(place2.blendMode).toBe(undefined);
        expect(place2.surfaceFilterList).toBe(undefined);

        const dictionary1 = object.dictionary[0];
        expect(dictionary1.name).toBe("");
        expect(dictionary1.characterId).toBe(bitmap1.id);
        expect(dictionary1.startFrame).toBe(1);
        expect(dictionary1.endFrame).toBe(2);
        expect(dictionary1.clipDepth).toBe(0);

        const dictionary2 = object.dictionary[1];
        expect(dictionary2.name).toBe("");
        expect(dictionary2.characterId).toBe(bitmap2.id);
        expect(dictionary2.startFrame).toBe(1);
        expect(dictionary2.endFrame).toBe(2);
        expect(dictionary2.clipDepth).toBe(0);

        Util.$workSpaces.length = 0;
    });
});

describe("MovieClip.js label test", () =>
{
    it("label test", () =>
    {
        const movieClip = new MovieClip({
            "id": 1,
            "name": "MovieClip_01",
            "type": InstanceType.MOVIE_CLIP
        });

        // 初期値
        expect(movieClip._$labels.size).toBe(0);

        movieClip.setLabel(2, "LABEL");
        expect(movieClip._$labels.size).toBe(1);
        expect(movieClip.getLabel(2)).toBe("LABEL");

        const labels = movieClip.labels;
        expect(labels.length).toBe(1);
        expect(labels[0].frame).toBe(2);
        expect(labels[0].name).toBe("LABEL");

        movieClip.deleteLabel(2);
        expect(movieClip._$labels.size).toBe(0);

        movieClip.labels = labels;
        expect(movieClip._$labels.size).toBe(1);
        expect(movieClip.getLabel(2)).toBe("LABEL");
    });
});

describe("MovieClip.js layer test", () =>
{
    beforeEach(() =>
    {
        document.body.innerHTML = window.__html__["test/test.html"];
    });

    it("layer test", () =>
    {
        const movieClip = new MovieClip({
            "id": 1,
            "name": "MovieClip_01",
            "type": InstanceType.MOVIE_CLIP
        });

        // 初期値
        expect(movieClip._$layers.size).toBe(0);

        const layer = new Layer();
        movieClip.addLayer(layer);
        expect(movieClip._$layers.size).toBe(1);
        expect(layer.id).toBe(0);
        expect(movieClip.getLayer(layer.id)).toBe(layer);

        movieClip.deleteLayer(layer.id);
        expect(movieClip._$layers.size).toBe(0);

        movieClip.setLayer(layer.id, layer);
        expect(movieClip._$layers.size).toBe(1);
        expect(movieClip.getLayer(layer.id)).toBe(layer);

        const layers = movieClip.layers;

        movieClip.clearLayer();
        expect(movieClip._$layers.size).toBe(0);

        movieClip.layers = layers;
        const newLayer = movieClip.getLayer(0);
        expect(layer.name).toBe(newLayer.name);
        expect(layer.color).toBe(newLayer.color);
    });
});

describe("MovieClip.js sounds test", () =>
{
    it("sound test", () =>
    {
        const movieClip = new MovieClip({
            "id": 1,
            "name": "MovieClip_01",
            "type": InstanceType.MOVIE_CLIP
        });

        // 初期値
        expect(movieClip._$sounds.size).toBe(0);
        expect(movieClip.hasSound(3)).toBe(false);

        const mockSounds = [{
            "characterId": 2,
            "name":        "test_sound.mp3",
            "volume":      100,
            "autoPlay":    false,
            "loopCount":   0
        }];

        movieClip.setSound(3, mockSounds);
        expect(movieClip.hasSound(3)).toBe(true);
        expect(movieClip.getSound(3)).toBe(mockSounds);

        const sounds = movieClip.sounds;
        expect(sounds[0].frame).toBe(3);
        expect(sounds[0].sound[0].characterId).toBe(2);
        expect(sounds[0].sound[0].name).toBe("test_sound.mp3");
        expect(sounds[0].sound[0].volume).toBe(100);
        expect(sounds[0].sound[0].autoPlay).toBe(false);
        expect(sounds[0].sound[0].loopCount).toBe(0);

        // 削除
        movieClip.deleteSound(3);
        expect(movieClip._$sounds.size).toBe(0);
        expect(movieClip.hasSound(3)).toBe(false);

        // 再登録
        movieClip.sounds = sounds;
        const newSounds = movieClip.getSound(3);
        expect(newSounds.length).toBe(1);
        expect(newSounds[0].characterId).toBe(2);
        expect(newSounds[0].name).toBe("test_sound.mp3");
        expect(newSounds[0].volume).toBe(100);
        expect(newSounds[0].autoPlay).toBe(false);
        expect(newSounds[0].loopCount).toBe(0);
    });
});

describe("MovieClip.js showController test", () =>
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

        const movieClip = new MovieClip({
            "id": 1,
            "name": "MovieClip_01",
            "type": InstanceType.MOVIE_CLIP
        });

        movieClip.showController({
            "frame": 1,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0,
            "loop": Util.$getDefaultLoopConfig()
        });
        expect(document.getElementById("sound-setting").style.display).toBe("none");
        expect(document.getElementById("ease-setting").style.display).toBe("none");
        expect(document.getElementById("text-setting").style.display).toBe("none");
        expect(document.getElementById("loop-setting").style.display).toBe("");
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

describe("MovieClip.js actions test", () =>
{
    it("action test", () =>
    {
        const movieClip = new MovieClip({
            "id": 1,
            "name": "MovieClip_01",
            "type": InstanceType.MOVIE_CLIP
        });

        // 初期値
        expect(movieClip._$actions.size).toBe(0);
        expect(movieClip.hasAction(4)).toBe(false);

        const script = "this.stop();";

        movieClip.setAction(4, script);
        expect(movieClip.hasAction(4)).toBe(true);
        expect(movieClip.getAction(4)).toBe(script);

        const actions = movieClip.actions;
        expect(actions[0].frame).toBe(4);
        expect(actions[0].action).toBe("this.stop();");

        // 削除
        movieClip.deleteAction(4);
        expect(movieClip._$actions.size).toBe(0);
        expect(movieClip.hasAction(4)).toBe(false);

        // 再登録
        movieClip.actions = actions;
        expect(movieClip.hasAction(4)).toBe(true);
        expect(movieClip.getAction(4)).toBe(script);
    });
});

describe("MovieClip.js function test", () =>
{
    beforeEach(() =>
    {
        document.body.innerHTML = window.__html__["test/test.html"];
    });

    it("function stop test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const movieClip = new MovieClip({
            "id": 1,
            "name": "MovieClip_01",
            "type": InstanceType.MOVIE_CLIP
        });
        workSpaces._$libraries.set(movieClip.id, movieClip);

        Util
            .$libraryController
            .createInstance(
                movieClip.type,
                movieClip.name,
                movieClip.id
            );

        const element = document
            .getElementById(`library-child-id-${movieClip.id}`);

        expect(element.draggable).toBe(true);
        element.draggable = false;
        expect(element.draggable).toBe(false);

        // 終了処理
        movieClip.stop();
        expect(element.draggable).toBe(true);

        Util.$workSpaces.length = 0;
    });
});
