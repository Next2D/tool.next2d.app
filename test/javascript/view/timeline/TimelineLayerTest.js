describe("TimelineLayer.js createMoveCharacters test", () =>
{
    beforeEach(() =>
    {
        document.body.innerHTML = window.__html__["test/test.html"];
    });

    /**
     * |1|2|3|4|
     * |空|空|空|空|
     * |■|■|■|■|
     * フレーム未設定
     * 1から4フレームを選択した場合
     */
    it("test case1", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const movieClip = new MovieClip({
            "id": 0,
            "name": "main",
            "type": InstanceType.MOVIE_CLIP
        });
        workSpaces._$libraries.set(movieClip.id, movieClip);
        workSpaces._$scene = movieClip;

        const bitmap = new Bitmap({
            "id": 1,
            "name": "Bitmap_01",
            "type": InstanceType.BITMAP,
            "width": 200,
            "height": 100
        });
        workSpaces._$libraries.set(bitmap.id, bitmap);

        const layer = new Layer();
        movieClip.setLayer(layer.id, layer);

        const timelineLayer = new TimelineLayer();
        const object = timelineLayer.createMoveCharacters(layer, [1,2,3,4]);

        const characters = object.characters;
        expect(characters.size).toBe(0);
        expect(object.emptys.length).toBe(1);

        expect(object.emptys[0].startFrame).toBe(1);
        expect(object.emptys[0].endFrame).toBe(5);

        Util.$workSpaces.length = 0;
    });

    /**
     * |1|2|3|4|5
     * |●|-|-|-|空|
     * |-|-|■|■|-|
     * 1フレームにキーフレームがある4フレームのDisplayObject
     * 3から4フレームを選択した場合
     */
    it("test case2", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const movieClip = new MovieClip({
            "id": 0,
            "name": "main",
            "type": InstanceType.MOVIE_CLIP
        });
        workSpaces._$libraries.set(movieClip.id, movieClip);
        workSpaces._$scene = movieClip;

        const bitmap = new Bitmap({
            "id": 1,
            "name": "Bitmap_01",
            "type": InstanceType.BITMAP,
            "width": 200,
            "height": 100
        });
        workSpaces._$libraries.set(bitmap.id, bitmap);

        const layer = new Layer();
        movieClip.setLayer(layer.id, layer);

        const character = new Character();
        character.libraryId  = 1;
        character.startFrame = 1;
        character.endFrame   = 5;
        character.setPlace(1, {
            "frame": 1,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0
        });
        layer.addCharacter(character);

        const timelineLayer = new TimelineLayer();
        const object = timelineLayer.createMoveCharacters(layer, [3,4]);

        const characters = object.characters;
        expect(characters.size).toBe(1);
        expect(object.emptys.length).toBe(0);

        const newCharacter = characters.values().next().value;
        expect(newCharacter._$places.size).toBe(1);
        expect(newCharacter.startFrame).toBe(3);
        expect(newCharacter.endFrame).toBe(5);

        Util.$workSpaces.length = 0;
    });

    /**
     * |1|2|3|4|5|6
     * |●|-|-|-|空|空|
     * |-|-|-|■|■|■|
     * 1フレームにキーフレームがある4フレームのDisplayObject
     * 4から6フレームを選択した場合
     */
    it("test case3", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const movieClip = new MovieClip({
            "id": 0,
            "name": "main",
            "type": InstanceType.MOVIE_CLIP
        });
        workSpaces._$libraries.set(movieClip.id, movieClip);
        workSpaces._$scene = movieClip;

        const bitmap = new Bitmap({
            "id": 1,
            "name": "Bitmap_01",
            "type": InstanceType.BITMAP,
            "width": 200,
            "height": 100
        });
        workSpaces._$libraries.set(bitmap.id, bitmap);

        const layer = new Layer();
        movieClip.setLayer(layer.id, layer);

        const character = new Character();
        character.libraryId  = 1;
        character.startFrame = 1;
        character.endFrame   = 5;
        character.setPlace(1, {
            "frame": 1,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0
        });
        layer.addCharacter(character);

        const timelineLayer = new TimelineLayer();
        const object = timelineLayer.createMoveCharacters(layer, [4,5,6]);

        const characters = object.characters;
        expect(characters.size).toBe(1);
        expect(object.emptys.length).toBe(0);

        const newCharacter = characters.values().next().value;
        expect(newCharacter._$places.size).toBe(1);
        expect(newCharacter.startFrame).toBe(4);
        expect(newCharacter.endFrame).toBe(7);

        Util.$workSpaces.length = 0;
    });

    /**
     * |1|2|3|4|5|6|7|8
     * |●|-|-|E|E|E|空|空|
     * |-|-|■|■|■|■|■|■|
     * 1フレームにキーフレームがある3フレームのDisplayObject
     * 4から6フレームの空のキーフレーム
     * 3から8フレームを選択した場合
     */
    it("test case4", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const movieClip = new MovieClip({
            "id": 0,
            "name": "main",
            "type": InstanceType.MOVIE_CLIP
        });
        workSpaces._$libraries.set(movieClip.id, movieClip);
        workSpaces._$scene = movieClip;

        const bitmap = new Bitmap({
            "id": 1,
            "name": "Bitmap_01",
            "type": InstanceType.BITMAP,
            "width": 200,
            "height": 100
        });
        workSpaces._$libraries.set(bitmap.id, bitmap);

        const layer = new Layer();
        movieClip.setLayer(layer.id, layer);

        const character = new Character();
        character.libraryId  = 1;
        character.startFrame = 1;
        character.endFrame   = 4;
        character.setPlace(1, {
            "frame": 1,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0
        });
        layer.addCharacter(character);

        layer.addEmptyCharacter(new EmptyCharacter({
            "startFrame": 4,
            "endFrame": 6
        }));

        const timelineLayer = new TimelineLayer();
        const object = timelineLayer.createMoveCharacters(layer, [3,4,5,6,7,8]);

        const characters = object.characters;
        expect(characters.size).toBe(1);
        expect(object.emptys.length).toBe(1);

        const newCharacter = characters.values().next().value;
        expect(newCharacter._$places.size).toBe(1);
        expect(newCharacter.startFrame).toBe(3);
        expect(newCharacter.endFrame).toBe(4);

        expect(object.emptys[0].startFrame).toBe(4);
        expect(object.emptys[0].endFrame).toBe(9);

        Util.$workSpaces.length = 0;
    });

    /**
     * |1|2|3|4|5|6|7|8
     * |E|E|●|-|E|E|空|空|
     * |■|■|■|■|■|■|■|■|
     * 1から2フレームの空のキーフレーム
     * 3フレームにキーフレームがある4フレームのDisplayObject
     * 5から6フレームの空のキーフレーム
     * 1から8フレームを選択した場合
     */
    it("test case5", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const movieClip = new MovieClip({
            "id": 0,
            "name": "main",
            "type": InstanceType.MOVIE_CLIP
        });
        workSpaces._$libraries.set(movieClip.id, movieClip);
        workSpaces._$scene = movieClip;

        const bitmap = new Bitmap({
            "id": 1,
            "name": "Bitmap_01",
            "type": InstanceType.BITMAP,
            "width": 200,
            "height": 100
        });
        workSpaces._$libraries.set(bitmap.id, bitmap);

        const layer = new Layer();
        movieClip.setLayer(layer.id, layer);

        const character = new Character();
        character.libraryId  = 1;
        character.startFrame = 3;
        character.endFrame   = 5;
        character.setPlace(3, {
            "frame": 3,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0
        });
        layer.addCharacter(character);

        layer.addEmptyCharacter(new EmptyCharacter({
            "startFrame": 1,
            "endFrame": 3
        }));
        layer.addEmptyCharacter(new EmptyCharacter({
            "startFrame": 5,
            "endFrame": 7
        }));

        const timelineLayer = new TimelineLayer();
        const object = timelineLayer.createMoveCharacters(layer, [1,2,3,4,5,6,7,8]);

        const characters = object.characters;
        expect(characters.size).toBe(1);
        expect(object.emptys.length).toBe(2);

        const newCharacter = characters.values().next().value;
        expect(newCharacter._$places.size).toBe(1);
        expect(newCharacter.startFrame).toBe(3);
        expect(newCharacter.endFrame).toBe(5);

        expect(object.emptys[0].startFrame).toBe(1);
        expect(object.emptys[0].endFrame).toBe(3);
        expect(object.emptys[1].startFrame).toBe(5);
        expect(object.emptys[1].endFrame).toBe(9);

        Util.$workSpaces.length = 0;
    });

    /**
     * |1|2|3|4|5|6|7|8
     * |●|-|E|E|●|-|空|空|
     * |■|■|■|■|■|■|■|■|
     * 1フレームにキーフレームがある2フレームのDisplayObject
     * 3から4フレームの空のキーフレーム
     * 5フレームにキーフレームがある2フレームのDisplayObject
     * 1から8フレームを選択した場合
     */
    it("test case6", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const movieClip = new MovieClip({
            "id": 0,
            "name": "main",
            "type": InstanceType.MOVIE_CLIP
        });
        workSpaces._$libraries.set(movieClip.id, movieClip);
        workSpaces._$scene = movieClip;

        const bitmap = new Bitmap({
            "id": 1,
            "name": "Bitmap_01",
            "type": InstanceType.BITMAP,
            "width": 200,
            "height": 100
        });
        workSpaces._$libraries.set(bitmap.id, bitmap);

        const layer = new Layer();
        movieClip.setLayer(layer.id, layer);

        const character1 = new Character();
        character1.libraryId  = 1;
        character1.startFrame = 1;
        character1.endFrame   = 3;
        character1.setPlace(1, {
            "frame": 1,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0
        });
        layer.addCharacter(character1);

        layer.addEmptyCharacter(new EmptyCharacter({
            "startFrame": 3,
            "endFrame": 5
        }));

        const character2 = new Character();
        character2.libraryId  = 1;
        character2.startFrame = 5;
        character2.endFrame   = 7;
        character2.setPlace(5, {
            "frame": 5,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0
        });
        layer.addCharacter(character2);

        const timelineLayer = new TimelineLayer();
        const object = timelineLayer.createMoveCharacters(layer, [1,2,3,4,5,6,7,8]);

        const characters = object.characters;
        expect(characters.size).toBe(2);
        expect(object.emptys.length).toBe(1);

        const iterator = characters.values();

        const newCharacter1 = iterator.next().value;
        expect(newCharacter1._$places.size).toBe(1);
        expect(newCharacter1.startFrame).toBe(1);
        expect(newCharacter1.endFrame).toBe(3);

        expect(object.emptys[0].startFrame).toBe(3);
        expect(object.emptys[0].endFrame).toBe(5);

        const newCharacter2 = iterator.next().value;
        expect(newCharacter2._$places.size).toBe(1);
        expect(newCharacter2.startFrame).toBe(5);
        expect(newCharacter2.endFrame).toBe(9);

        Util.$workSpaces.length = 0;
    });

    /**
     * |1|2|3|4|5|6|7|8
     * |●|-|●|-|E|E|空|空|
     * |■|■|■|■|■|■|■|■|
     * 1フレームと3フレームにキーフレームがある4フレームのDisplayObject
     * 5から6フレームの空のキーフレーム
     * 1から8フレームを選択した場合
     */
    it("test case7", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const movieClip = new MovieClip({
            "id": 0,
            "name": "main",
            "type": InstanceType.MOVIE_CLIP
        });
        workSpaces._$libraries.set(movieClip.id, movieClip);
        workSpaces._$scene = movieClip;

        const bitmap = new Bitmap({
            "id": 1,
            "name": "Bitmap_01",
            "type": InstanceType.BITMAP,
            "width": 200,
            "height": 100
        });
        workSpaces._$libraries.set(bitmap.id, bitmap);

        const layer = new Layer();
        movieClip.setLayer(layer.id, layer);

        const character = new Character();
        character.libraryId  = 1;
        character.startFrame = 1;
        character.endFrame   = 5;
        character.setPlace(1, {
            "frame": 1,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0
        });
        character.setPlace(3, {
            "frame": 3,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0
        });
        layer.addCharacter(character);

        layer.addEmptyCharacter(new EmptyCharacter({
            "startFrame": 5,
            "endFrame": 7
        }));

        const timelineLayer = new TimelineLayer();
        const object = timelineLayer.createMoveCharacters(layer, [1,2,3,4,5,6,7,8]);

        const characters = object.characters;
        expect(characters.size).toBe(1);
        expect(object.emptys.length).toBe(1);

        const iterator = characters.values();

        const newCharacter = iterator.next().value;
        expect(newCharacter._$places.size).toBe(2);
        expect(newCharacter.startFrame).toBe(1);
        expect(newCharacter.endFrame).toBe(5);

        expect(object.emptys[0].startFrame).toBe(5);
        expect(object.emptys[0].endFrame).toBe(9);

        Util.$workSpaces.length = 0;
    });

    /**
     * |1|2|3|4|5|6|
     * |●|-|●|-|空|空|
     * |■|■|■|■|■|■|
     * 1フレームと3フレームにキーフレームがある4フレームのDisplayObject
     * 1から8フレームを選択した場合
     */
    it("test case8", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const movieClip = new MovieClip({
            "id": 0,
            "name": "main",
            "type": InstanceType.MOVIE_CLIP
        });
        workSpaces._$libraries.set(movieClip.id, movieClip);
        workSpaces._$scene = movieClip;

        const bitmap = new Bitmap({
            "id": 1,
            "name": "Bitmap_01",
            "type": InstanceType.BITMAP,
            "width": 200,
            "height": 100
        });
        workSpaces._$libraries.set(bitmap.id, bitmap);

        const layer = new Layer();
        movieClip.setLayer(layer.id, layer);

        const character = new Character();
        character.libraryId  = 1;
        character.startFrame = 1;
        character.endFrame   = 5;
        character.setPlace(1, {
            "frame": 1,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0
        });
        character.setPlace(3, {
            "frame": 3,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0
        });
        layer.addCharacter(character);

        const timelineLayer = new TimelineLayer();
        const object = timelineLayer.createMoveCharacters(layer, [1,2,3,4,5,6]);

        const characters = object.characters;
        expect(characters.size).toBe(1);
        expect(object.emptys.length).toBe(0);

        const iterator = characters.values();

        const newCharacter = iterator.next().value;
        expect(newCharacter._$places.size).toBe(2);
        expect(newCharacter.startFrame).toBe(1);
        expect(newCharacter.endFrame).toBe(7);

        Util.$workSpaces.length = 0;
    });

    /**
     * |1|2|3|4|5|6|
     * |●|-|E|E|空|空|
     * |-|-|-|■|■|■|
     * 1フレームとキーフレームがある2フレームのDisplayObject
     * 3から4フレームの空のキーフレーム
     * 4から6フレームを選択した場合
     */
    it("test case9", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const movieClip = new MovieClip({
            "id": 0,
            "name": "main",
            "type": InstanceType.MOVIE_CLIP
        });
        workSpaces._$libraries.set(movieClip.id, movieClip);
        workSpaces._$scene = movieClip;

        const bitmap = new Bitmap({
            "id": 1,
            "name": "Bitmap_01",
            "type": InstanceType.BITMAP,
            "width": 200,
            "height": 100
        });
        workSpaces._$libraries.set(bitmap.id, bitmap);

        const layer = new Layer();
        movieClip.setLayer(layer.id, layer);

        const character = new Character();
        character.libraryId  = 1;
        character.startFrame = 1;
        character.endFrame   = 3;
        character.setPlace(1, {
            "frame": 1,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0
        });
        layer.addCharacter(character);

        layer.addEmptyCharacter(new EmptyCharacter({
            "startFrame": 3,
            "endFrame": 5
        }));

        const timelineLayer = new TimelineLayer();
        const object = timelineLayer.createMoveCharacters(layer, [4,5,6]);

        const characters = object.characters;
        expect(characters.size).toBe(0);
        expect(object.emptys.length).toBe(1);

        expect(object.emptys[0].startFrame).toBe(4);
        expect(object.emptys[0].endFrame).toBe(7);

        Util.$workSpaces.length = 0;
    });
});

describe("TimelineLayer.js deleteDestinationKeyFrame test", () =>
{
    beforeEach(() =>
    {
        document.body.innerHTML = window.__html__["test/test.html"];
    });

    /**
     * |1|2|3|4|
     * |空|空|空|空|
     * |■|■|■|■|
     * フレーム未設定
     * 1から4フレームを選択した場合
     */
    it("test case1", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const movieClip = new MovieClip({
            "id": 0,
            "name": "main",
            "type": InstanceType.MOVIE_CLIP
        });
        workSpaces._$libraries.set(movieClip.id, movieClip);
        workSpaces._$scene = movieClip;

        const bitmap = new Bitmap({
            "id": 1,
            "name": "Bitmap_01",
            "type": InstanceType.BITMAP,
            "width": 200,
            "height": 100
        });
        workSpaces._$libraries.set(bitmap.id, bitmap);

        const layer = new Layer();
        movieClip.setLayer(layer.id, layer);

        const character = new Character();
        character.libraryId  = 1;
        character.startFrame = 1;
        character.endFrame   = 3;
        character.setPlace(1, {
            "frame": 1,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0
        });
        layer.addCharacter(character);

        const timelineLayer = new TimelineLayer();
        const object = timelineLayer.createMoveCharacters(layer, [1,2,3,4]);
        timelineLayer.deleteDestinationKeyFrame(
            layer, object.characters, layer.id,
        );

        Util.$workSpaces.length = 0;
    });

});