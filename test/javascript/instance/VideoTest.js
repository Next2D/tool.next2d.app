describe("Video.js property test", () =>
{
    it("property test", () =>
    {
        const video = new Video({
            "buffer": new Uint8Array([1,1,1,1,101,1,1,110]),
            "width": 560,
            "height": 315
        });

        // mock
        window.next2d = {
            "media": {
                "Video": {
                    "namespace": "next2d.media.Video"
                }
            }
        };

        expect(video.buffer).toBe("\x01\x01\x01\x01e\x01\x01n");
        expect(video.volume).toBe(100);
        expect(video.loop).toBe(false);
        expect(video.autoPlay).toBe(true);
        expect(video.defaultSymbol).toBe("next2d.media.Video");
    });
});

describe("Video.js showController test", () =>
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

        const video = new Video({
            "buffer": new Uint8Array([1,1,1,1,101,1,1,110]),
            "width": 560,
            "height": 315
        });

        video.showController({
            "frame": 1,
            "matrix": [1, 0, 0, 1, 0, 0],
            "colorTransform": [1, 1, 1, 1, 0, 0, 0, 0],
            "blendMode": "normal",
            "filter": [],
            "depth": 0
        });
        expect(document.getElementById("sound-setting").style.display).toBe("none");
        expect(document.getElementById("ease-setting").style.display).toBe("none");
        expect(document.getElementById("text-setting").style.display).toBe("none");
        expect(document.getElementById("loop-setting").style.display).toBe("none");
        expect(document.getElementById("video-setting").style.display).toBe("");
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

describe("Video.js function test", () =>
{
    it("function getPreview test", () =>
    {
        const video = new Video({
            "buffer": new Uint8Array([1,1,1,1,101,1,1,110]),
            "width": 560,
            "height": 315
        });

        expect(video.getPreview() instanceof HTMLVideoElement).toBe(true);
    });

    it("function getBounds and bounds test", () =>
    {
        const video = new Video({
            "buffer": new Uint8Array([1,1,1,1,101,1,1,110]),
            "width": 560,
            "height": 315
        });

        const bounds1 = video.getBounds();

        expect(bounds1.xMin).toBe(0);
        expect(bounds1.xMax).toBe(560);
        expect(bounds1.yMin).toBe(0);
        expect(bounds1.yMax).toBe(315);

        const bounds2 = video.getBounds([1.2, 0, 0.2, 1.9, 100, 200]);
        expect(bounds2.xMin).toBe(100);
        expect(bounds2.xMax).toBe(835);
        expect(bounds2.yMin).toBe(200);
        expect(bounds2.yMax).toBe(798.5);
    });

    it("function toObject test", () =>
    {
        const video = new Video({
            "id": 10,
            "name": "Video_01",
            "type": InstanceType.VIDEO,
            "symbol": "app.video",
            "buffer": new Uint8Array([1,1,1,1,101,1,1,110]),
            "width": 560,
            "height": 315
        });

        const object = video.toObject();
        expect(object.id).toBe(10);
        expect(object.name).toBe("Video_01");
        expect(object.type).toBe(InstanceType.VIDEO);
        expect(object.symbol).toBe("app.video");
        expect(object.folderId).toBe(0);
        expect(object.buffer).toBe("\x01\x01\x01\x01e\x01\x01n");
        expect(object.volume).toBe(100);
        expect(object.loop).toBe(false);
        expect(object.autoPlay).toBe(true);
        expect(object.width).toBe(560);
        expect(object.height).toBe(315);
    });

    it("function toPublish test", () =>
    {
        const video = new Video({
            "id": 10,
            "name": "Video_01",
            "type": InstanceType.VIDEO,
            "symbol": "app.video",
            "buffer": new Uint8Array([1,1,1,1,101,1,1,110]),
            "width": 560,
            "height": 315
        });

        // mock
        window.next2d = {
            "media": {
                "Video": {
                    "namespace": "next2d.media.Video"
                }
            }
        };

        const object = video.toPublish();
        expect(object.symbol).toBe("app.video");
        expect(object.extends).toBe("next2d.media.Video");
        expect(object.buffer[0]).toBe(1);
        expect(object.buffer[1]).toBe(1);
        expect(object.buffer[2]).toBe(1);
        expect(object.buffer[3]).toBe(1);
        expect(object.buffer[4]).toBe(101);
        expect(object.buffer[5]).toBe(1);
        expect(object.buffer[6]).toBe(1);
        expect(object.buffer[7]).toBe(110);
        expect(object.loop).toBe(false);
        expect(object.autoPlay).toBe(true);
        expect(object.volume).toBe(1);
        expect(object.bounds.xMin).toBe(0);
        expect(object.bounds.xMax).toBe(560);
        expect(object.bounds.yMin).toBe(0);
        expect(object.bounds.yMax).toBe(315);
    });
});
