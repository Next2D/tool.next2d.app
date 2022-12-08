describe("ToolEvent.js createMoveCharacters test", () =>
{
    beforeEach(() =>
    {
        document.body.innerHTML = window.__html__["test/test.html"];
    });

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
        const object = timelineLayer.createMoveCharacters(layer, [4,5]);

        const characters = object.characters;
        expect(characters.size).toBe(1);
        expect(object.emptys.length).toBe(0);

        const newCharacter = characters.values().next().value;
        expect(newCharacter._$places.size).toBe(1);
        expect(newCharacter.startFrame).toBe(4);
        expect(newCharacter.endFrame).toBe(6);

        Util.$workSpaces.length = 0;
    });
});