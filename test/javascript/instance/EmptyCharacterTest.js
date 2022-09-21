describe("EmptyCharacter.js property test", () =>
{
    it("property test", () =>
    {
        const emptyCharacter = new EmptyCharacter();

        // 初期値
        expect(emptyCharacter.startFrame).toBe(1);
        expect(emptyCharacter.endFrame).toBe(2);
    });
});

describe("EmptyCharacter.js function test", () =>
{
    it("clone test", () =>
    {
        const emptyCharacter = new EmptyCharacter();

        const clone = emptyCharacter.clone();
        clone.startFrame = 9;
        clone.endFrame = 19;

        expect(emptyCharacter.startFrame).toBe(1);
        expect(emptyCharacter.endFrame).toBe(2);
        expect(clone.startFrame).toBe(9);
        expect(clone.endFrame).toBe(19);
    });

    it("toObject test", () =>
    {
        const emptyCharacter = new EmptyCharacter({
            "startFrame": 5,
            "endFrame": 10
        });

        const object = emptyCharacter.toObject();
        expect(object.startFrame).toBe(5);
        expect(object.endFrame).toBe(10);
    });

    it("move test", () =>
    {
        const emptyCharacter = new EmptyCharacter({
            "startFrame": 5,
            "endFrame": 10
        });

        emptyCharacter.move(10);
        expect(emptyCharacter.startFrame).toBe(15);
        expect(emptyCharacter.endFrame).toBe(20);
    });

    it("split test", () =>
    {
        const emptyCharacter = new EmptyCharacter({
            "startFrame": 5,
            "endFrame": 20
        });

        const layer = new Layer();
        expect(layer._$emptys.length).toBe(0);

        emptyCharacter.split(layer, 10, 15);
        expect(layer._$emptys.length).toBe(2);

        const emptyCharacterA = layer._$emptys[0];
        expect(emptyCharacterA.startFrame).toBe(5);
        expect(emptyCharacterA.endFrame).toBe(10);

        const emptyCharacterB = layer._$emptys[1];
        expect(emptyCharacterB.startFrame).toBe(15);
        expect(emptyCharacterB.endFrame).toBe(20);
    });
});
