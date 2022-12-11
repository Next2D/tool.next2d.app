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
        expect(newCharacter.hasPlace(3)).toBe(true);
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
        expect(newCharacter.hasPlace(4)).toBe(true);
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
        expect(newCharacter.hasPlace(3)).toBe(true);
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
        expect(newCharacter.hasPlace(3)).toBe(true);
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
        expect(newCharacter1.hasPlace(1)).toBe(true);
        expect(newCharacter1.startFrame).toBe(1);
        expect(newCharacter1.endFrame).toBe(3);

        expect(object.emptys[0].startFrame).toBe(3);
        expect(object.emptys[0].endFrame).toBe(5);

        const newCharacter2 = iterator.next().value;
        expect(newCharacter2._$places.size).toBe(1);
        expect(newCharacter2.hasPlace(5)).toBe(true);
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
        expect(newCharacter.hasPlace(1)).toBe(true);
        expect(newCharacter.hasPlace(3)).toBe(true);
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
        expect(newCharacter.hasPlace(1)).toBe(true);
        expect(newCharacter.hasPlace(3)).toBe(true);
        expect(newCharacter.startFrame).toBe(1);
        expect(newCharacter.endFrame).toBe(7);

        Util.$workSpaces.length = 0;
    });

    /**
     * |1|2|3|4|5|6|
     * |●|-|E|E|空|空|
     * |-|-|-|■|■|■|
     * 1フレームにキーフレームがある2フレームのDisplayObject
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

    /**
     * |1|2|3|4|5|6|
     * |●|-|-|-|空|空|
     * |■|■|■|-|-|-|
     * 1フレームにtweenキーフレームがある4フレームのDisplayObject
     * 1から3フレームを選択した場合
     */
    it("test case10", () =>
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
        character.libraryId  = 2;
        character.startFrame = 1;
        character.endFrame   = 5;
        character.setPlace(1, {
            "frame": 1,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0,
            "tweenFrame": 1
        });
        character.setPlace(2, {
            "frame": 2,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0,
            "tweenFrame": 1
        });
        character.setPlace(3, {
            "frame": 3,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0,
            "tweenFrame": 1
        });
        character.setPlace(4, {
            "frame": 4,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0,
            "tweenFrame": 1
        });
        character.setTween(1, {
            "method": "linear",
            "curve": [],
            "custom": Util.$tweenController.createEasingObject(),
            "startFrame": 1,
            "endFrame": 5
        });
        layer.addCharacter(character);

        const timelineLayer = new TimelineLayer();
        const object = timelineLayer.createMoveCharacters(layer, [1,2,3]);

        const characters = object.characters;
        expect(characters.size).toBe(1);
        expect(object.emptys.length).toBe(0);

        const iterator = characters.values();

        const newCharacter = iterator.next().value;
        expect(newCharacter._$places.size).toBe(3);
        expect(newCharacter.hasPlace(1)).toBe(true);
        expect(newCharacter.getPlace(1).tweenFrame).toBe(1);
        expect(newCharacter.startFrame).toBe(1);
        expect(newCharacter.endFrame).toBe(4);

        const tween = newCharacter.getTween(1);
        expect(tween.startFrame).toBe(1);
        expect(tween.endFrame).toBe(4);

        Util.$workSpaces.length = 0;
    });

    /**
     * |1|2|3|4|5|6|
     * |●|-|-|-|空|空|
     * |-|-|-|■|■|■|
     * 1フレームにtweenキーフレームがある4フレームのDisplayObject
     * 4から6フレームを選択した場合
     */
    it("test case11", () =>
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
        character.libraryId  = 2;
        character.startFrame = 1;
        character.endFrame   = 5;
        character.setPlace(1, {
            "frame": 1,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0,
            "tweenFrame": 1
        });
        character.setPlace(2, {
            "frame": 2,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0,
            "tweenFrame": 1
        });
        character.setPlace(3, {
            "frame": 3,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0,
            "tweenFrame": 1
        });
        character.setPlace(4, {
            "frame": 4,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0,
            "tweenFrame": 1
        });
        character.setTween(1, {
            "method": "linear",
            "curve": [],
            "custom": Util.$tweenController.createEasingObject(),
            "startFrame": 1,
            "endFrame": 5
        });
        layer.addCharacter(character);

        const timelineLayer = new TimelineLayer();
        const object = timelineLayer.createMoveCharacters(layer, [4,5,6]);

        const characters = object.characters;
        expect(characters.size).toBe(1);
        expect(object.emptys.length).toBe(0);

        const iterator = characters.values();

        const newCharacter = iterator.next().value;
        expect(newCharacter._$places.size).toBe(3);
        expect(newCharacter.hasPlace(4)).toBe(true);
        expect(newCharacter.getPlace(4).tweenFrame).toBe(4);
        expect(newCharacter.startFrame).toBe(4);
        expect(newCharacter.endFrame).toBe(7);

        const tween = newCharacter.getTween(4);
        expect(tween.startFrame).toBe(4);
        expect(tween.endFrame).toBe(7);

        Util.$workSpaces.length = 0;
    });

    /**
     * |1|2|3|4|5|6|
     * |●|-|-|-|空|空|
     * |-|■|■|-|-|-|
     * 1フレームにtweenキーフレームがある4フレームのDisplayObject
     * 2から3フレームを選択した場合
     */
    it("test case12", () =>
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
        character.libraryId  = 2;
        character.startFrame = 1;
        character.endFrame   = 5;
        character.setPlace(1, {
            "frame": 1,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0,
            "tweenFrame": 1
        });
        character.setPlace(2, {
            "frame": 2,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0,
            "tweenFrame": 1
        });
        character.setPlace(3, {
            "frame": 3,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0,
            "tweenFrame": 1
        });
        character.setPlace(4, {
            "frame": 4,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0,
            "tweenFrame": 1
        });
        character.setTween(1, {
            "method": "linear",
            "curve": [],
            "custom": Util.$tweenController.createEasingObject(),
            "startFrame": 1,
            "endFrame": 5
        });
        layer.addCharacter(character);

        const timelineLayer = new TimelineLayer();
        const object = timelineLayer.createMoveCharacters(layer, [2,3]);

        const characters = object.characters;
        expect(characters.size).toBe(1);
        expect(object.emptys.length).toBe(0);

        const iterator = characters.values();

        const newCharacter = iterator.next().value;
        expect(newCharacter._$places.size).toBe(2);
        expect(newCharacter.hasPlace(2)).toBe(true);
        expect(newCharacter.getPlace(2).tweenFrame).toBe(2);
        expect(newCharacter.startFrame).toBe(2);
        expect(newCharacter.endFrame).toBe(4);

        const tween = newCharacter.getTween(2);
        expect(tween.startFrame).toBe(2);
        expect(tween.endFrame).toBe(4);

        Util.$workSpaces.length = 0;
    });

    /**
     * |1|2|3|4|5|6|
     * |●|-|●|-|空|空|
     * |■|■|■|■|■|-|
     * 1フレームと3フレームにtweenキーフレームがある4フレームのDisplayObject
     * 1から5フレームを選択した場合
     */
    it("test case13", () =>
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
        character.libraryId  = 2;
        character.startFrame = 1;
        character.endFrame   = 5;
        character.setPlace(1, {
            "frame": 1,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0,
            "tweenFrame": 1
        });
        character.setPlace(2, {
            "frame": 2,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0,
            "tweenFrame": 1
        });
        character.setPlace(3, {
            "frame": 3,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0,
            "tweenFrame": 3
        });
        character.setPlace(4, {
            "frame": 4,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0,
            "tweenFrame": 3
        });
        character.setTween(1, {
            "method": "linear",
            "curve": [],
            "custom": Util.$tweenController.createEasingObject(),
            "startFrame": 1,
            "endFrame": 3
        });
        character.setTween(3, {
            "method": "linear",
            "curve": [],
            "custom": Util.$tweenController.createEasingObject(),
            "startFrame": 3,
            "endFrame": 5
        });
        layer.addCharacter(character);

        const timelineLayer = new TimelineLayer();
        const object = timelineLayer.createMoveCharacters(layer, [1,2,3,4,5]);

        const characters = object.characters;
        expect(characters.size).toBe(1);
        expect(object.emptys.length).toBe(0);

        const iterator = characters.values();

        const newCharacter = iterator.next().value;
        expect(newCharacter._$places.size).toBe(5);
        expect(newCharacter.getPlace(1).tweenFrame).toBe(1);
        expect(newCharacter.getPlace(3).tweenFrame).toBe(3);
        expect(newCharacter.startFrame).toBe(1);
        expect(newCharacter.endFrame).toBe(6);

        const tween1 = newCharacter.getTween(1);
        expect(tween1.startFrame).toBe(1);
        expect(tween1.endFrame).toBe(3);

        const tween2 = newCharacter.getTween(3);
        expect(tween2.startFrame).toBe(3);
        expect(tween2.endFrame).toBe(6);

        Util.$workSpaces.length = 0;
    });

    /**
     * |1|2|3|4|5|6|
     * |●|-|●|-|空|空|
     * |-|■|■|■|■|-|
     * 1フレームと3フレームにtweenキーフレームがある4フレームのDisplayObject
     * 2から5フレームを選択した場合
     */
    it("test case14", () =>
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
        character.libraryId  = 2;
        character.startFrame = 1;
        character.endFrame   = 5;
        character.setPlace(1, {
            "frame": 1,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0,
            "tweenFrame": 1
        });
        character.setPlace(2, {
            "frame": 2,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0,
            "tweenFrame": 1
        });
        character.setPlace(3, {
            "frame": 3,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0,
            "tweenFrame": 3
        });
        character.setPlace(4, {
            "frame": 4,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0,
            "tweenFrame": 3
        });
        character.setTween(1, {
            "method": "linear",
            "curve": [],
            "custom": Util.$tweenController.createEasingObject(),
            "startFrame": 1,
            "endFrame": 3
        });
        character.setTween(3, {
            "method": "linear",
            "curve": [],
            "custom": Util.$tweenController.createEasingObject(),
            "startFrame": 3,
            "endFrame": 5
        });
        layer.addCharacter(character);

        const timelineLayer = new TimelineLayer();
        const object = timelineLayer.createMoveCharacters(layer, [2,3,4,5]);

        const characters = object.characters;
        expect(characters.size).toBe(1);
        expect(object.emptys.length).toBe(0);

        const iterator = characters.values();

        const newCharacter = iterator.next().value;
        expect(newCharacter._$places.size).toBe(4);
        expect(newCharacter._$tween.size).toBe(2);
        expect(newCharacter.getPlace(2).tweenFrame).toBe(2);
        expect(newCharacter.getPlace(3).tweenFrame).toBe(3);
        expect(newCharacter.startFrame).toBe(2);
        expect(newCharacter.endFrame).toBe(6);

        const tween1 = newCharacter.getTween(2);
        expect(tween1.startFrame).toBe(2);
        expect(tween1.endFrame).toBe(3);

        const tween2 = newCharacter.getTween(3);
        expect(tween2.startFrame).toBe(3);
        expect(tween2.endFrame).toBe(6);

        Util.$workSpaces.length = 0;
    });

    /**
     * |1|2|3|4|5|6|7|8|9|
     * |●|-|-|●|-|-|-|空|空|
     * |-|■|■|■|■|■|■|■|-|
     * 1フレームと4フレームにtweenキーフレームがある8フレームのDisplayObject
     * 2から8フレームを選択した場合
     */
    it("test case15", () =>
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
        character.libraryId  = 2;
        character.startFrame = 1;
        character.endFrame   = 8;
        character.setPlace(1, {
            "frame": 1,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0,
            "tweenFrame": 1
        });
        character.setPlace(2, {
            "frame": 2,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0,
            "tweenFrame": 1
        });
        character.setPlace(3, {
            "frame": 3,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0,
            "tweenFrame": 1
        });
        character.setPlace(4, {
            "frame": 4,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0,
            "tweenFrame": 4
        });
        character.setPlace(5, {
            "frame": 5,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0,
            "tweenFrame": 4
        });
        character.setPlace(6, {
            "frame": 6,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0,
            "tweenFrame": 4
        });
        character.setPlace(7, {
            "frame": 7,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0,
            "tweenFrame": 4
        });
        character.setTween(1, {
            "method": "linear",
            "curve": [],
            "custom": Util.$tweenController.createEasingObject(),
            "startFrame": 1,
            "endFrame": 4
        });
        character.setTween(4, {
            "method": "linear",
            "curve": [],
            "custom": Util.$tweenController.createEasingObject(),
            "startFrame": 4,
            "endFrame": 8
        });
        layer.addCharacter(character);

        const timelineLayer = new TimelineLayer();
        const object = timelineLayer.createMoveCharacters(layer, [2,3,4,5,6,7,8]);

        const characters = object.characters;
        expect(characters.size).toBe(1);
        expect(object.emptys.length).toBe(0);

        const iterator = characters.values();

        const newCharacter = iterator.next().value;
        expect(newCharacter._$places.size).toBe(7);
        expect(newCharacter._$tween.size).toBe(2);
        expect(newCharacter.getPlace(2).tweenFrame).toBe(2);
        expect(newCharacter.getPlace(4).tweenFrame).toBe(4);
        expect(newCharacter.startFrame).toBe(2);
        expect(newCharacter.endFrame).toBe(9);

        const tween1 = newCharacter.getTween(2);
        expect(tween1.startFrame).toBe(2);
        expect(tween1.endFrame).toBe(4);

        const tween2 = newCharacter.getTween(4);
        expect(tween2.startFrame).toBe(4);
        expect(tween2.endFrame).toBe(9);

        Util.$workSpaces.length = 0;
    });

    /**
     * |1|2|3|4|5|6|7|8|9|
     * |●|-|-|●|-|-|-|空|空|
     * |-|-|-|-|-|-|■|-|-|
     * 1フレームと4フレームにtweenキーフレームがある8フレームのDisplayObject
     * 7フレームを選択した場合
     */
    it("test case16", () =>
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
        character.libraryId  = 2;
        character.startFrame = 1;
        character.endFrame   = 8;
        character.setPlace(1, {
            "frame": 1,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0,
            "tweenFrame": 1
        });
        character.setPlace(2, {
            "frame": 2,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0,
            "tweenFrame": 1
        });
        character.setPlace(3, {
            "frame": 3,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0,
            "tweenFrame": 1
        });
        character.setPlace(4, {
            "frame": 4,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0,
            "tweenFrame": 4
        });
        character.setPlace(5, {
            "frame": 5,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0,
            "tweenFrame": 4
        });
        character.setPlace(6, {
            "frame": 6,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0,
            "tweenFrame": 4
        });
        character.setPlace(7, {
            "frame": 7,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0,
            "tweenFrame": 4
        });
        character.setTween(1, {
            "method": "linear",
            "curve": [],
            "custom": Util.$tweenController.createEasingObject(),
            "startFrame": 1,
            "endFrame": 4
        });
        character.setTween(4, {
            "method": "linear",
            "curve": [],
            "custom": Util.$tweenController.createEasingObject(),
            "startFrame": 4,
            "endFrame": 8
        });
        layer.addCharacter(character);

        const timelineLayer = new TimelineLayer();
        const object = timelineLayer.createMoveCharacters(layer, [7]);

        const characters = object.characters;
        expect(characters.size).toBe(1);
        expect(object.emptys.length).toBe(0);

        const iterator = characters.values();

        const newCharacter = iterator.next().value;
        expect(newCharacter._$places.size).toBe(1);
        expect(newCharacter._$tween.size).toBe(1);
        expect(newCharacter.getPlace(7).tweenFrame).toBe(7);
        expect(newCharacter.startFrame).toBe(7);
        expect(newCharacter.endFrame).toBe(8);

        const tween = newCharacter.getTween(7);
        expect(tween.startFrame).toBe(7);
        expect(tween.endFrame).toBe(8);

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
     * |1|2|3|4|5|6|
     * |●|-|-|●|-|-|
     * フレーム未設定
     * 1フレームとキーフレームがある3フレームのDisplayObject
     * 3フレームとキーフレームがある3フレームのDisplayObject
     * 4から6フレームを選択して、1から3フレームに移動
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

        const character1 = new Character();
        character1.libraryId  = 1;
        character1.startFrame = 1;
        character1.endFrame   = 4;
        character1.setPlace(1, {
            "frame": 1,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0
        });
        layer.addCharacter(character1);

        const character2 = new Character();
        character2.libraryId  = 1;
        character2.startFrame = 4;
        character2.endFrame   = 7;
        character2.setPlace(4, {
            "frame": 4,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0
        });
        layer.addCharacter(character2);

        expect(layer._$characters.length).toBe(2);

        const timelineLayer = new TimelineLayer();
        const object = timelineLayer.createMoveCharacters(layer, [4,5,6]);
        timelineLayer.deleteDestinationKeyFrame(
            layer, object.characters, layer.id, 1, 4
        );

        expect(layer._$characters.length).toBe(1);
        expect(layer._$characters[0]).toBe(character2);

        Util.$workSpaces.length = 0;
    });

    /**
     * |1|2|3|4|5|6|
     * |●|-|-|空|空|空|
     * フレーム未設定
     * 1フレームとキーフレームがある3フレームのDisplayObject
     * 1から3フレームを選択して、4から6フレームに移動
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

        expect(layer._$characters.length).toBe(1);

        const timelineLayer = new TimelineLayer();
        const object = timelineLayer.createMoveCharacters(layer, [1,2,3]);
        timelineLayer.deleteDestinationKeyFrame(
            layer, object.characters, layer.id, 4, 7
        );

        expect(layer._$characters.length).toBe(1);
        expect(layer._$characters[0]).toBe(character);

        Util.$workSpaces.length = 0;
    });
});