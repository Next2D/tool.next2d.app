// test/global-setup.ts
class MockOffscreenCanvas {
    width: number;
    height: number;

    constructor (width: number, height: number)
    {
        this.width  = width;
        this.height = height;
    }

    getContext () {
        // CanvasRenderingContext2D などをモック
        return {
            // 必要に応じてメソッドを追加
            "fillRect": (x: number, y: number, w: number, h: number) => {}
        };
    }
}

if (typeof globalThis.OffscreenCanvas === "undefined") {
    (globalThis as any).OffscreenCanvas = MockOffscreenCanvas;
}

class MockAudioContext {}
if (typeof globalThis.AudioContext === "undefined") {
    (globalThis as any).AudioContext = MockAudioContext;
}

class MockImageData {}
if (typeof globalThis.ImageData === "undefined") {
    (globalThis as any).ImageData = MockImageData;
}

if (typeof globalThis.indexedDB === "undefined") {
    (globalThis as any).indexedDB = {
        "open": () => {
            return {
                "addEventListener": () => {
                    // 何もしない
                }
            };
        }
    };
}

if (typeof globalThis.ace === "undefined") {
    (globalThis as any).ace = {
        "edit": (id: string) =>
        {
            return {
                "getValue": () =>
                {
                    return "test";
                },
                "setValue": (value: string) =>
                {
                    // 何もしない
                },
                "focus": () => {}
            };
        }
    };
}
