import { describe, it, expect, beforeEach, vi } from "vitest";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";
import type { Layer } from "@/core/domain/model/Layer";
import type { Character } from "@/core/domain/model/Character";

// モック関数の定義（vi.mockより前に定義）
const mock$getCurrentWorkSpace = vi.fn();
const mockExternalCharacterSetX = vi.fn();
const mockExternalCharacterSetY = vi.fn();
const mockExternalCharacterGetX = vi.fn();
const mockExternalCharacterGetY = vi.fn();

// vi.mockの呼び出し
vi.mock("@/core/application/CoreUtil", () => ({
    $getCurrentWorkSpace: () => mock$getCurrentWorkSpace()
}));

vi.mock("@/external/core/domain/model/ExternalCharacter", () => ({
    ExternalCharacter: vi.fn().mockImplementation(() => ({
        setX: mockExternalCharacterSetX,
        setY: mockExternalCharacterSetY,
        getX: mockExternalCharacterGetX,
        getY: mockExternalCharacterGetY
    }))
}));

// 実際のインポート（vi.mockの後）
const { execute } = await import("./ScreenDisplayObjectUpdateSelectedValueService");
const { transformSetting } = await import("@/controller/domain/model/TransformSetting");

describe("ScreenDisplayObjectUpdateSelectedValueService", () => {
    let mockWorkSpace: WorkSpace;
    let mockMovieClip: MovieClip;
    let mockLayer: Layer;
    let mockCharacter: Character;

    beforeEach(() => {
        vi.clearAllMocks();

        // transformSettingのリセット
        transformSetting.x = 0;
        transformSetting.y = 0;
        transformSetting.beforeX = 0;
        transformSetting.beforeY = 0;

        mockCharacter = {
            x: 100,
            y: 100
        } as Character;

        mockLayer = {
            getCharacter: vi.fn(() => mockCharacter)
        } as unknown as Layer;

        const selectedDepths = new Map([[0, [1]]]);
        mockMovieClip = {
            currentFrame: 1,
            selectedDepths: selectedDepths,
            getLayer: vi.fn(() => mockLayer)
        } as unknown as MovieClip;

        mockWorkSpace = {
            scene: mockMovieClip
        } as unknown as WorkSpace;

        mock$getCurrentWorkSpace.mockReturnValue(mockWorkSpace);
        mockExternalCharacterGetX.mockReturnValue(100);
        mockExternalCharacterGetY.mockReturnValue(100);
    });

    describe("基本的な移動処理", () => {
        it("X方向のみの移動を処理する", async () => {
            transformSetting.x = 50;
            transformSetting.y = 0;
            transformSetting.beforeX = 100;
            transformSetting.beforeY = 100;

            await execute();

            // beforeX, beforeYに戻される
            expect(mockCharacter.x).toBe(100);
            expect(mockCharacter.y).toBe(100);

            // ExternalCharacter.setXが呼ばれる
            expect(mockExternalCharacterSetX).toHaveBeenCalledWith(150); // 100 + 50
            expect(mockExternalCharacterSetY).not.toHaveBeenCalled();
        });

        it("Y方向のみの移動を処理する", async () => {
            transformSetting.x = 0;
            transformSetting.y = 30;
            transformSetting.beforeX = 50;
            transformSetting.beforeY = 60;

            await execute();

            // beforeX, beforeYに戻される
            expect(mockCharacter.x).toBe(50);
            expect(mockCharacter.y).toBe(60);

            // ExternalCharacter.setYが呼ばれる
            expect(mockExternalCharacterSetX).not.toHaveBeenCalled();
            expect(mockExternalCharacterSetY).toHaveBeenCalledWith(130); // 100 + 30
        });

        it("X, Y両方向の移動を処理する", async () => {
            transformSetting.x = 20;
            transformSetting.y = 40;
            transformSetting.beforeX = 80;
            transformSetting.beforeY = 90;
            mockExternalCharacterGetX.mockReturnValue(80);
            mockExternalCharacterGetY.mockReturnValue(90);

            await execute();

            // beforeX, beforeYに戻される
            expect(mockCharacter.x).toBe(80);
            expect(mockCharacter.y).toBe(90);

            // 両方のsetメソッドが呼ばれる
            expect(mockExternalCharacterSetX).toHaveBeenCalledWith(100); // 80 + 20
            expect(mockExternalCharacterSetY).toHaveBeenCalledWith(130); // 90 + 40
        });

        it("移動量が0の場合は何もしない", async () => {
            transformSetting.x = 0;
            transformSetting.y = 0;
            transformSetting.beforeX = 100;
            transformSetting.beforeY = 100;

            await execute();

            // beforeX, beforeYに戻されるが、setメソッドは呼ばれない
            expect(mockCharacter.x).toBe(100);
            expect(mockCharacter.y).toBe(100);
            expect(mockExternalCharacterSetX).not.toHaveBeenCalled();
            expect(mockExternalCharacterSetY).not.toHaveBeenCalled();
        });
    });

    describe("負の移動量", () => {
        it("X方向の負の移動量を処理する", async () => {
            transformSetting.x = -30;
            transformSetting.y = 0;
            transformSetting.beforeX = 200;
            transformSetting.beforeY = 150;
            mockExternalCharacterGetX.mockReturnValue(200);

            await execute();

            expect(mockCharacter.x).toBe(200);
            expect(mockExternalCharacterSetX).toHaveBeenCalledWith(170); // 200 + (-30)
        });

        it("Y方向の負の移動量を処理する", async () => {
            transformSetting.x = 0;
            transformSetting.y = -50;
            transformSetting.beforeX = 100;
            transformSetting.beforeY = 200;
            mockExternalCharacterGetY.mockReturnValue(200);

            await execute();

            expect(mockCharacter.y).toBe(200);
            expect(mockExternalCharacterSetY).toHaveBeenCalledWith(150); // 200 + (-50)
        });

        it("両方向の負の移動量を処理する", async () => {
            transformSetting.x = -10;
            transformSetting.y = -20;
            transformSetting.beforeX = 100;
            transformSetting.beforeY = 100;
            mockExternalCharacterGetX.mockReturnValue(100);
            mockExternalCharacterGetY.mockReturnValue(100);

            await execute();

            expect(mockExternalCharacterSetX).toHaveBeenCalledWith(90); // 100 + (-10)
            expect(mockExternalCharacterSetY).toHaveBeenCalledWith(80); // 100 + (-20)
        });
    });

    describe("複数のキャラクター選択", () => {
        it("複数の深度のキャラクターを更新する", async () => {
            const mockCharacter2 = { x: 200, y: 200 } as Character;
            const mockCharacter3 = { x: 300, y: 300 } as Character;

            let callCount = 0;
            mockLayer.getCharacter = vi.fn((_frame: number, depth: number) => {
                if (depth === 1) return mockCharacter;
                if (depth === 2) return mockCharacter2;
                if (depth === 3) return mockCharacter3;
                return null;
            });

            const selectedDepthsMultiple = new Map([[0, [1, 2, 3]]]);
            Object.defineProperty(mockMovieClip, 'selectedDepths', {
                value: selectedDepthsMultiple,
                writable: true,
                configurable: true
            });

            mockExternalCharacterGetX.mockImplementation(() => {
                callCount++;
                if (callCount === 1 || callCount === 2) return 100;
                if (callCount === 3 || callCount === 4) return 200;
                return 300;
            });

            mockExternalCharacterGetY.mockImplementation(() => {
                callCount++;
                if (callCount <= 2) return 100;
                if (callCount <= 4) return 200;
                return 300;
            });

            transformSetting.x = 10;
            transformSetting.y = 20;
            transformSetting.beforeX = 0;
            transformSetting.beforeY = 0;

            await execute();

            // 3つのキャラクターすべてが更新される
            expect(mockLayer.getCharacter).toHaveBeenCalledTimes(3);
            expect(mockExternalCharacterSetX).toHaveBeenCalledTimes(3);
            expect(mockExternalCharacterSetY).toHaveBeenCalledTimes(3);

            // 各キャラクターのbeforeX, beforeYへの復元を確認
            expect(mockCharacter.x).toBe(0);
            expect(mockCharacter.y).toBe(0);
            expect(mockCharacter2.x).toBe(0);
            expect(mockCharacter2.y).toBe(0);
            expect(mockCharacter3.x).toBe(0);
            expect(mockCharacter3.y).toBe(0);
        });

        it("複数のレイヤーのキャラクターを更新する", async () => {
            const mockLayer2 = {
                getCharacter: vi.fn(() => ({ x: 150, y: 150 } as Character))
            } as unknown as Layer;

            const selectedDepthsMultiLayer = new Map([
                [0, [1]],
                [1, [2]]
            ]);
            Object.defineProperty(mockMovieClip, 'selectedDepths', {
                value: selectedDepthsMultiLayer,
                writable: true,
                configurable: true
            });

            mockMovieClip.getLayer = vi.fn((index: number) => {
                if (index === 0) return mockLayer;
                if (index === 1) return mockLayer2;
                return null;
            });

            transformSetting.x = 5;
            transformSetting.y = 10;
            transformSetting.beforeX = 50;
            transformSetting.beforeY = 60;

            await execute();

            // 2つのレイヤーから取得される
            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(0);
            expect(mockMovieClip.getLayer).toHaveBeenCalledWith(1);

            // 両方のキャラクターが更新される
            expect(mockExternalCharacterSetX).toHaveBeenCalledTimes(2);
            expect(mockExternalCharacterSetY).toHaveBeenCalledTimes(2);
        });
    });

    describe("エッジケース", () => {
        it("レイヤーが存在しない場合はスキップする", async () => {
            mockMovieClip.getLayer = vi.fn(() => null);

            transformSetting.x = 10;
            transformSetting.y = 10;

            await execute();

            // キャラクターの取得は行われない
            expect(mockExternalCharacterSetX).not.toHaveBeenCalled();
            expect(mockExternalCharacterSetY).not.toHaveBeenCalled();
        });

        it("キャラクターが存在しない場合はスキップする", async () => {
            mockLayer.getCharacter = vi.fn(() => null);

            transformSetting.x = 10;
            transformSetting.y = 10;

            await execute();

            // setメソッドは呼ばれない
            expect(mockExternalCharacterSetX).not.toHaveBeenCalled();
            expect(mockExternalCharacterSetY).not.toHaveBeenCalled();
        });

        it("selectedDepthsが空の場合は何もしない", async () => {
            const emptySelectedDepths = new Map();
            Object.defineProperty(mockMovieClip, 'selectedDepths', {
                value: emptySelectedDepths,
                writable: true,
                configurable: true
            });

            transformSetting.x = 10;
            transformSetting.y = 10;

            await execute();

            expect(mockMovieClip.getLayer).not.toHaveBeenCalled();
            expect(mockExternalCharacterSetX).not.toHaveBeenCalled();
            expect(mockExternalCharacterSetY).not.toHaveBeenCalled();
        });

        it("depths配列が空の場合は何もしない", async () => {
            const emptyDepthsSelectedDepths = new Map([[0, []]]);
            Object.defineProperty(mockMovieClip, 'selectedDepths', {
                value: emptyDepthsSelectedDepths,
                writable: true,
                configurable: true
            });

            transformSetting.x = 10;
            transformSetting.y = 10;

            await execute();

            expect(mockLayer.getCharacter).not.toHaveBeenCalled();
            expect(mockExternalCharacterSetX).not.toHaveBeenCalled();
            expect(mockExternalCharacterSetY).not.toHaveBeenCalled();
        });
    });

    describe("座標の復元処理", () => {
        it("移動前の座標に正しく戻される", async () => {
            mockCharacter.x = 500;
            mockCharacter.y = 600;
            transformSetting.beforeX = 250;
            transformSetting.beforeY = 350;
            transformSetting.x = 100;
            transformSetting.y = 150;

            await execute();

            // beforeX, beforeYに戻される
            expect(mockCharacter.x).toBe(250);
            expect(mockCharacter.y).toBe(350);
        });

        it("beforeXとbeforeYが0の場合", async () => {
            mockCharacter.x = 100;
            mockCharacter.y = 200;
            transformSetting.beforeX = 0;
            transformSetting.beforeY = 0;
            transformSetting.x = 50;
            transformSetting.y = 0;
            mockExternalCharacterGetX.mockReturnValue(0);

            await execute();

            expect(mockCharacter.x).toBe(0);
            expect(mockCharacter.y).toBe(0);
            expect(mockExternalCharacterSetX).toHaveBeenCalledWith(50); // 0 + 50
        });

        it("beforeXとbeforeYが負の値の場合", async () => {
            mockCharacter.x = 100;
            mockCharacter.y = 200;
            transformSetting.beforeX = -50;
            transformSetting.beforeY = -100;
            transformSetting.x = 20;
            transformSetting.y = 0;
            mockExternalCharacterGetX.mockReturnValue(-50);

            await execute();

            expect(mockCharacter.x).toBe(-50);
            expect(mockCharacter.y).toBe(-100);
            expect(mockExternalCharacterSetX).toHaveBeenCalledWith(-30); // -50 + 20
        });
    });

    describe("currentFrameの使用", () => {
        it("currentFrameに基づいてキャラクターを取得する", async () => {
            mockMovieClip.currentFrame = 10;

            transformSetting.x = 5;
            transformSetting.y = 0;

            await execute();

            expect(mockLayer.getCharacter).toHaveBeenCalledWith(10, 1);
        });

        it("異なるフレームでの処理", async () => {
            mockMovieClip.currentFrame = 25;

            transformSetting.x = 0;
            transformSetting.y = 15;

            await execute();

            expect(mockLayer.getCharacter).toHaveBeenCalledWith(25, 1);
        });

        it("フレーム1での処理", async () => {
            mockMovieClip.currentFrame = 1;

            transformSetting.x = 10;
            transformSetting.y = 10;

            await execute();

            expect(mockLayer.getCharacter).toHaveBeenCalledWith(1, 1);
        });
    });

    describe("ExternalCharacterの使用", () => {
        it("ExternalCharacterが正しいパラメータで初期化される", async () => {
            const { ExternalCharacter } = await import("@/external/core/domain/model/ExternalCharacter");

            transformSetting.x = 10;
            transformSetting.y = 0;

            await execute();

            // ExternalCharacterのコンストラクタが正しい引数で呼ばれる
            expect(ExternalCharacter).toHaveBeenCalledWith(
                mockWorkSpace,
                mockMovieClip,
                mockLayer,
                mockCharacter
            );
        });

        it("ExternalCharacter.getXとsetXが連携する", async () => {
            mockExternalCharacterGetX.mockReturnValue(150);
            transformSetting.x = 25;
            transformSetting.y = 0;

            await execute();

            expect(mockExternalCharacterGetX).toHaveBeenCalled();
            expect(mockExternalCharacterSetX).toHaveBeenCalledWith(175); // 150 + 25
        });

        it("ExternalCharacter.getYとsetYが連携する", async () => {
            mockExternalCharacterGetY.mockReturnValue(200);
            transformSetting.x = 0;
            transformSetting.y = 50;

            await execute();

            expect(mockExternalCharacterGetY).toHaveBeenCalled();
            expect(mockExternalCharacterSetY).toHaveBeenCalledWith(250); // 200 + 50
        });
    });

    describe("非同期処理", () => {
        it("setXが非同期で処理される", async () => {
            mockExternalCharacterSetX.mockResolvedValue(undefined);
            transformSetting.x = 10;
            transformSetting.y = 0;

            await execute();

            expect(mockExternalCharacterSetX).toHaveBeenCalled();
        });

        it("setYが非同期で処理される", async () => {
            mockExternalCharacterSetY.mockResolvedValue(undefined);
            transformSetting.x = 0;
            transformSetting.y = 10;

            await execute();

            expect(mockExternalCharacterSetY).toHaveBeenCalled();
        });

        it("setXとsetYが順次実行される", async () => {
            const callOrder: string[] = [];

            mockExternalCharacterSetX.mockImplementation(async () => {
                callOrder.push("setX");
            });

            mockExternalCharacterSetY.mockImplementation(async () => {
                callOrder.push("setY");
            });

            transformSetting.x = 10;
            transformSetting.y = 20;

            await execute();

            // setXが先に呼ばれる
            expect(callOrder).toEqual(["setX", "setY"]);
        });
    });

    describe("統合シナリオ", () => {
        it("完全な移動処理フロー", async () => {
            // 初期状態
            mockCharacter.x = 100;
            mockCharacter.y = 150;
            transformSetting.beforeX = 100;
            transformSetting.beforeY = 150;
            transformSetting.x = 50;
            transformSetting.y = -30;
            mockExternalCharacterGetX.mockReturnValue(100);
            mockExternalCharacterGetY.mockReturnValue(150);

            await execute();

            // 座標がbeforeに戻される
            expect(mockCharacter.x).toBe(100);
            expect(mockCharacter.y).toBe(150);

            // 新しい座標が設定される
            expect(mockExternalCharacterSetX).toHaveBeenCalledWith(150); // 100 + 50
            expect(mockExternalCharacterSetY).toHaveBeenCalledWith(120); // 150 + (-30)

            // ExternalCharacterが正しく初期化される
            const { ExternalCharacter } = await import("@/external/core/domain/model/ExternalCharacter");
            expect(ExternalCharacter).toHaveBeenCalledWith(
                mockWorkSpace,
                mockMovieClip,
                mockLayer,
                mockCharacter
            );
        });

        it("複数キャラクターの同時移動", async () => {
            const mockCharacter2 = { x: 200, y: 250 } as Character;

            mockLayer.getCharacter = vi.fn((_frame: number, depth: number) => {
                if (depth === 1) return mockCharacter;
                if (depth === 2) return mockCharacter2;
                return null;
            });

            const selectedDepthsMultiChar = new Map([[0, [1, 2]]]);
            Object.defineProperty(mockMovieClip, 'selectedDepths', {
                value: selectedDepthsMultiChar,
                writable: true,
                configurable: true
            });

            let getXCallCount = 0;
            let getYCallCount = 0;

            mockExternalCharacterGetX.mockImplementation(() => {
                getXCallCount++;
                return getXCallCount === 1 ? 100 : 200;
            });

            mockExternalCharacterGetY.mockImplementation(() => {
                getYCallCount++;
                return getYCallCount === 1 ? 150 : 250;
            });

            transformSetting.beforeX = 100;
            transformSetting.beforeY = 150;
            transformSetting.x = 25;
            transformSetting.y = 35;

            await execute();

            // 両方のキャラクターが処理される
            expect(mockLayer.getCharacter).toHaveBeenCalledTimes(2);

            // 両方のキャラクターの座標が復元される
            expect(mockCharacter.x).toBe(100);
            expect(mockCharacter.y).toBe(150);
            expect(mockCharacter2.x).toBe(100);
            expect(mockCharacter2.y).toBe(150);

            // 両方のキャラクターに新しい座標が設定される
            expect(mockExternalCharacterSetX).toHaveBeenCalledTimes(2);
            expect(mockExternalCharacterSetY).toHaveBeenCalledTimes(2);
        });

        it("一部のキャラクターが存在しない場合", async () => {
            mockLayer.getCharacter = vi.fn((_frame: number, depth: number) => {
                if (depth === 1) return mockCharacter;
                if (depth === 2) return null; // 存在しない
                if (depth === 3) return { x: 300, y: 300 } as Character;
                return null;
            });

            const selectedDepthsPartial = new Map([[0, [1, 2, 3]]]);
            Object.defineProperty(mockMovieClip, 'selectedDepths', {
                value: selectedDepthsPartial,
                writable: true,
                configurable: true
            });

            transformSetting.x = 10;
            transformSetting.y = 10;

            await execute();

            // depth=1とdepth=3のみ処理される（depth=2はスキップ）
            expect(mockLayer.getCharacter).toHaveBeenCalledTimes(3);
            expect(mockExternalCharacterSetX).toHaveBeenCalledTimes(2);
            expect(mockExternalCharacterSetY).toHaveBeenCalledTimes(2);
        });
    });

    describe("小数点を含む座標", () => {
        it("小数点を含むX座標の移動", async () => {
            transformSetting.x = 12.5;
            transformSetting.y = 0;
            transformSetting.beforeX = 100.3;
            transformSetting.beforeY = 200.7;
            mockExternalCharacterGetX.mockReturnValue(100.3);

            await execute();

            expect(mockCharacter.x).toBe(100.3);
            expect(mockCharacter.y).toBe(200.7);
            expect(mockExternalCharacterSetX).toHaveBeenCalledWith(112.8); // 100.3 + 12.5
        });

        it("小数点を含むY座標の移動", async () => {
            transformSetting.x = 0;
            transformSetting.y = 7.8;
            transformSetting.beforeX = 50.5;
            transformSetting.beforeY = 60.2;
            mockExternalCharacterGetY.mockReturnValue(60.2);

            await execute();

            expect(mockCharacter.x).toBe(50.5);
            expect(mockCharacter.y).toBe(60.2);
            expect(mockExternalCharacterSetY).toHaveBeenCalledWith(68); // 60.2 + 7.8
        });
    });
});
