describe("Sound.js property test", () =>
{
    it("property test", () =>
    {
        const sound = new Sound({
            "buffer": new Uint8Array([1,1,1,1,101,1,1,110])
        });

        // mock
        window.next2d = {
            "media": {
                "Sound": {
                    "namespace": "next2d.media.Sound"
                }
            }
        };

        expect(sound.buffer).toBe("\x01\x01\x01\x01e\x01\x01n");
        expect(sound.volume).toBe(100);
        expect(sound.loopCount).toBe(0);
        expect(sound.defaultSymbol).toBe("next2d.media.Sound");
    });
});

describe("Sound.js function test", () =>
{
    it("function getPreview test", () =>
    {
        const sound = new Sound({
            "buffer": new Uint8Array([1,1,1,1,101,1,1,110])
        });

        sound
            .getPreview()
            .then((element) =>
            {
                expect(element instanceof HTMLAudioElement).toBe(true);
            });
    });

    it("function toObject test", () =>
    {
        const sound = new Sound({
            "id": 10,
            "name": "Sound_01",
            "type": InstanceType.SOUND,
            "symbol": "app.sound",
            "buffer": new Uint8Array([1,1,1,1,101,1,1,110])
        });

        const object = sound.toObject();
        expect(object.id).toBe(10);
        expect(object.name).toBe("Sound_01");
        expect(object.type).toBe(InstanceType.SOUND);
        expect(object.symbol).toBe("app.sound");
        expect(object.folderId).toBe(0);
        expect(object.buffer).toBe("\x01\x01\x01\x01e\x01\x01n");
        expect(object.volume).toBe(100);
        expect(object.loopCount).toBe(0);
    });

    it("function toPublish test", () =>
    {
        const sound = new Sound({
            "id": 10,
            "name": "Sound_01",
            "type": InstanceType.SOUND,
            "symbol": "app.sound",
            "buffer": new Uint8Array([1,1,1,1,101,1,1,110])
        });

        const object = sound.toPublish();
        expect(object.buffer[0]).toBe(1);
        expect(object.buffer[1]).toBe(1);
        expect(object.buffer[2]).toBe(1);
        expect(object.buffer[3]).toBe(1);
        expect(object.buffer[4]).toBe(101);
        expect(object.buffer[5]).toBe(1);
        expect(object.buffer[6]).toBe(1);
        expect(object.buffer[7]).toBe(110);
        expect(object.audioBuffer).toBe(null);
        expect(object.init).toBe(false);
    });
});
