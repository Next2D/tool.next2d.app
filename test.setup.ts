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

class MockImageData {
    get data ()
    {
        return {
            "set": (data: Uint8ClampedArray) => { return void 0 }
        };
    }
}
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
            let value = "test";
            return {
                "getValue": () =>
                {
                    return value;
                },
                "setValue": (v: string) =>
                {
                    value = v;
                },
                "focus": () => {}
            };
        }
    };
}

// requestAnimationFrame and cancelAnimationFrame mocks
(globalThis as any).requestAnimationFrame = (callback: FrameRequestCallback) => {
    return setTimeout(() => callback(Date.now()), 16) as unknown as number;
};

(globalThis as any).cancelAnimationFrame = (id: number) => {
    clearTimeout(id);
};

// Mock Worker
if (typeof globalThis.Worker === "undefined") {
    class MockWorker {
        onmessage: ((event: MessageEvent) => void) | null = null;
        onerror: ((error: ErrorEvent) => void) | null = null;
        
        constructor(scriptURL: string | URL, options?: WorkerOptions) {
            // Mock worker - do nothing
        }
        
        postMessage(message: any, transfer?: Transferable[]): void {
            // Mock postMessage - simulate immediate response
            setTimeout(() => {
                if (this.onmessage) {
                    this.onmessage(new MessageEvent("message", { data: message }));
                }
            }, 0);
        }
        
        terminate(): void {
            // Mock terminate
        }
        
        addEventListener(type: string, listener: EventListenerOrEventListenerObject): void {
            // Mock addEventListener
        }
        
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject): void {
            // Mock removeEventListener
        }
        
        dispatchEvent(event: Event): boolean {
            return true;
        }
    }
    
    (globalThis as any).Worker = MockWorker;
}
