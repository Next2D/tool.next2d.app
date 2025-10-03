import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { execute } from "./SoundAreaRebuildSettingAreaUseCase";
import { $SOUND_AREA_SOUND_LIST_AREA_ID } from "@/config/SoundSettingConfig";

// サービスとユーティリティのモック
const mockSoundAreaAddSettingAreaUseCase = vi.fn();
const mock$getCurrentWorkSpace = vi.fn();

vi.mock("./SoundAreaAddSettingAreaUseCase", () => ({
    execute: mockSoundAreaAddSettingAreaUseCase
}));

vi.mock("@/core/application/CoreUtil", () => ({
    $getCurrentWorkSpace: mock$getCurrentWorkSpace
}));

vi.mock("@/timeline/domain/model/TimelineHeader", () => ({
    timelineHeader: {
        stopFlag: true
    }
}));

describe("SoundAreaRebuildSettingAreaUseCase", () => {
    let mockElement: HTMLElement;
    let mockWorkSpace: any;
    let mockMovieClip: any;
    let mockSound: any;
    let mockSoundObject: any;

    beforeEach(() => {
        vi.clearAllMocks();

        // 基本的なDOM要素のセットアップ
        mockElement = document.createElement("div");
        mockElement.id = $SOUND_AREA_SOUND_LIST_AREA_ID;
        document.body.appendChild(mockElement);

        // モックサウンドオブジェクトのセットアップ
        mockSoundObject = {
            libraryId: "sound1",
            volume: 1.0,
            loop: 0
        };

        // モックサウンドのセットアップ
        mockSound = {
            name: "Test Sound",
            id: "sound1"
        };

        // モックMovieClipのセットアップ
        mockMovieClip = {
            selectedDepths: new Map(),
            currentFrame: 1,
            getSound: vi.fn().mockReturnValue([mockSoundObject])
        };

        // モックWorkSpaceのセットアップ
        mockWorkSpace = {
            scene: mockMovieClip,
            getLibrary: vi.fn().mockReturnValue(mockSound)
        };

        mock$getCurrentWorkSpace.mockReturnValue(mockWorkSpace);
        mockSoundAreaAddSettingAreaUseCase.mockResolvedValue(undefined);
    });

    afterEach(() => {
        document.body.removeChild(mockElement);
        vi.resetAllMocks();
    });

    describe("早期リターン条件", () => {
        it("再生中（stopFlag=false）の場合、何も処理しない", async () => {
            const { timelineHeader } = await import("@/timeline/domain/model/TimelineHeader");
            timelineHeader.stopFlag = false;

            await execute();

            expect(mockSoundAreaAddSettingAreaUseCase).not.toHaveBeenCalled();
        });

        it("サウンドリストエリア要素が存在しない場合、何も処理しない", async () => {
            document.body.removeChild(mockElement);

            await execute();

            expect(mockSoundAreaAddSettingAreaUseCase).not.toHaveBeenCalled();
        });

        it("DisplayObjectが選択されている場合、何も処理しない", async () => {
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);

            await execute();

            expect(mockSoundAreaAddSettingAreaUseCase).not.toHaveBeenCalled();
        });

        it("現在のフレームにサウンドが存在しない場合、何も処理しない", async () => {
            mockMovieClip.getSound.mockReturnValue(null);

            await execute();

            expect(mockSoundAreaAddSettingAreaUseCase).not.toHaveBeenCalled();
        });

        it("サウンドの配列が空の場合、何も処理しない", async () => {
            mockMovieClip.getSound.mockReturnValue([]);

            await execute();

            expect(mockSoundAreaAddSettingAreaUseCase).not.toHaveBeenCalled();
        });
    });

    describe("設定エリアの初期化", () => {
        it("既存の子要素がすべて削除される", async () => {
            const child1 = document.createElement("div");
            const child2 = document.createElement("div");
            const child3 = document.createElement("div");
            mockElement.appendChild(child1);
            mockElement.appendChild(child2);
            mockElement.appendChild(child3);

            expect(mockElement.children.length).toBe(3);

            await execute();

            expect(mockElement.children.length).toBe(0);
        });

        it("子要素がない場合もエラーなく処理される", async () => {
            expect(mockElement.children.length).toBe(0);

            await execute();

            expect(mockElement.children.length).toBe(0);
        });

        it("複数の子要素があってもすべて削除される", async () => {
            for (let i = 0; i < 10; i++) {
                const child = document.createElement("div");
                child.textContent = `Child ${i}`;
                mockElement.appendChild(child);
            }

            expect(mockElement.children.length).toBe(10);

            await execute();

            expect(mockElement.children.length).toBe(0);
        });
    });

    describe("単一サウンドの処理", () => {
        it("1つのサウンドが正しく追加される", async () => {
            await execute();

            expect(mockSoundAreaAddSettingAreaUseCase).toHaveBeenCalledTimes(1);
            expect(mockSoundAreaAddSettingAreaUseCase).toHaveBeenCalledWith(
                0,
                "Test Sound",
                mockSoundObject
            );
        });

        it("currentFrameのサウンドが取得される", async () => {
            mockMovieClip.currentFrame = 5;

            await execute();

            expect(mockMovieClip.getSound).toHaveBeenCalledWith(5);
        });

        it("libraryIdからサウンドライブラリが取得される", async () => {
            await execute();

            expect(mockWorkSpace.getLibrary).toHaveBeenCalledWith("sound1");
        });

        it("サウンド名が正しく渡される", async () => {
            mockSound.name = "Background Music";

            await execute();

            expect(mockSoundAreaAddSettingAreaUseCase).toHaveBeenCalledWith(
                0,
                "Background Music",
                mockSoundObject
            );
        });

        it("インデックスが0から始まる", async () => {
            await execute();

            const calls = mockSoundAreaAddSettingAreaUseCase.mock.calls;
            expect(calls[0][0]).toBe(0);
        });
    });

    describe("複数サウンドの処理", () => {
        it("複数のサウンドが順次追加される", async () => {
            const soundObject2 = { libraryId: "sound2", volume: 0.8, loop: 1 };
            const soundObject3 = { libraryId: "sound3", volume: 0.5, loop: 0 };
            mockMovieClip.getSound.mockReturnValue([
                mockSoundObject,
                soundObject2,
                soundObject3
            ]);

            const sound2 = { name: "Sound Effect 1", id: "sound2" };
            const sound3 = { name: "Sound Effect 2", id: "sound3" };
            mockWorkSpace.getLibrary
                .mockReturnValueOnce(mockSound)
                .mockReturnValueOnce(sound2)
                .mockReturnValueOnce(sound3);

            await execute();

            expect(mockSoundAreaAddSettingAreaUseCase).toHaveBeenCalledTimes(3);
            expect(mockSoundAreaAddSettingAreaUseCase).toHaveBeenNthCalledWith(
                1, 0, "Test Sound", mockSoundObject
            );
            expect(mockSoundAreaAddSettingAreaUseCase).toHaveBeenNthCalledWith(
                2, 1, "Sound Effect 1", soundObject2
            );
            expect(mockSoundAreaAddSettingAreaUseCase).toHaveBeenNthCalledWith(
                3, 2, "Sound Effect 2", soundObject3
            );
        });

        it("10個のサウンドが正しく処理される", async () => {
            const sounds = Array.from({ length: 10 }, (_, i) => ({
                libraryId: `sound${i}`,
                volume: 1.0,
                loop: 0
            }));
            mockMovieClip.getSound.mockReturnValue(sounds);

            mockWorkSpace.getLibrary.mockImplementation((id: string) => ({
                name: `Sound ${id}`,
                id
            }));

            await execute();

            expect(mockSoundAreaAddSettingAreaUseCase).toHaveBeenCalledTimes(10);
            for (let i = 0; i < 10; i++) {
                expect(mockSoundAreaAddSettingAreaUseCase).toHaveBeenNthCalledWith(
                    i + 1,
                    i,
                    `Sound sound${i}`,
                    sounds[i]
                );
            }
        });

        it("各サウンドのインデックスが正しく渡される", async () => {
            const sounds = [
                { libraryId: "sound1", volume: 1.0, loop: 0 },
                { libraryId: "sound2", volume: 0.8, loop: 1 },
                { libraryId: "sound3", volume: 0.5, loop: 2 }
            ];
            mockMovieClip.getSound.mockReturnValue(sounds);

            mockWorkSpace.getLibrary.mockImplementation((id: string) => ({
                name: `Sound ${id}`,
                id
            }));

            await execute();

            const calls = mockSoundAreaAddSettingAreaUseCase.mock.calls;
            expect(calls[0][0]).toBe(0);
            expect(calls[1][0]).toBe(1);
            expect(calls[2][0]).toBe(2);
        });
    });

    describe("サウンドオブジェクトの検証", () => {
        it("soundObjectがnullの場合はスキップされる", async () => {
            mockMovieClip.getSound.mockReturnValue([
                mockSoundObject,
                null,
                { libraryId: "sound3", volume: 0.5, loop: 0 }
            ]);

            mockWorkSpace.getLibrary.mockImplementation((id: string) => ({
                name: `Sound ${id}`,
                id
            }));

            await execute();

            expect(mockSoundAreaAddSettingAreaUseCase).toHaveBeenCalledTimes(2);
            expect(mockSoundAreaAddSettingAreaUseCase).toHaveBeenNthCalledWith(
                1, 0, "Sound sound1", mockSoundObject
            );
            expect(mockSoundAreaAddSettingAreaUseCase).toHaveBeenNthCalledWith(
                2, 2, "Sound sound3", expect.any(Object)
            );
        });

        it("soundObjectがundefinedの場合はスキップされる", async () => {
            mockMovieClip.getSound.mockReturnValue([
                mockSoundObject,
                undefined,
                { libraryId: "sound3", volume: 0.5, loop: 0 }
            ]);

            mockWorkSpace.getLibrary.mockImplementation((id: string) => ({
                name: `Sound ${id}`,
                id
            }));

            await execute();

            expect(mockSoundAreaAddSettingAreaUseCase).toHaveBeenCalledTimes(2);
        });

        it("ライブラリからサウンドが見つからない場合はスキップされる", async () => {
            mockMovieClip.getSound.mockReturnValue([
                mockSoundObject,
                { libraryId: "sound2", volume: 0.8, loop: 1 },
                { libraryId: "sound3", volume: 0.5, loop: 0 }
            ]);

            mockWorkSpace.getLibrary
                .mockReturnValueOnce(mockSound)
                .mockReturnValueOnce(null)  // sound2が見つからない
                .mockReturnValueOnce({ name: "Sound 3", id: "sound3" });

            await execute();

            expect(mockSoundAreaAddSettingAreaUseCase).toHaveBeenCalledTimes(2);
            expect(mockSoundAreaAddSettingAreaUseCase).toHaveBeenNthCalledWith(
                1, 0, "Test Sound", mockSoundObject
            );
            expect(mockSoundAreaAddSettingAreaUseCase).toHaveBeenNthCalledWith(
                2, 2, "Sound 3", expect.any(Object)
            );
        });

        it("複数のサウンドでnullやライブラリ未検出が混在する場合", async () => {
            mockMovieClip.getSound.mockReturnValue([
                mockSoundObject,
                null,
                { libraryId: "sound3", volume: 0.5, loop: 0 },
                { libraryId: "sound4", volume: 0.3, loop: 1 },
                undefined
            ]);

            mockWorkSpace.getLibrary
                .mockReturnValueOnce(mockSound)
                .mockReturnValueOnce(null)  // sound3のライブラリが見つからない
                .mockReturnValueOnce({ name: "Sound 4", id: "sound4" });

            await execute();

            expect(mockSoundAreaAddSettingAreaUseCase).toHaveBeenCalledTimes(2);
            expect(mockSoundAreaAddSettingAreaUseCase).toHaveBeenNthCalledWith(
                1, 0, "Test Sound", mockSoundObject
            );
            expect(mockSoundAreaAddSettingAreaUseCase).toHaveBeenNthCalledWith(
                2, 3, "Sound 4", expect.any(Object)
            );
        });
    });

    describe("非同期処理", () => {
        it("各サウンドの追加が非同期で実行される", async () => {
            const sounds = [
                { libraryId: "sound1", volume: 1.0, loop: 0 },
                { libraryId: "sound2", volume: 0.8, loop: 1 }
            ];
            mockMovieClip.getSound.mockReturnValue(sounds);

            mockWorkSpace.getLibrary.mockImplementation((id: string) => ({
                name: `Sound ${id}`,
                id
            }));

            let callCount = 0;
            mockSoundAreaAddSettingAreaUseCase.mockImplementation(async () => {
                await new Promise(resolve => setTimeout(resolve, 10));
                callCount++;
            });

            await execute();

            expect(callCount).toBe(2);
        });

        it("複数のサウンドが順次処理される", async () => {
            const sounds = [
                { libraryId: "sound1", volume: 1.0, loop: 0 },
                { libraryId: "sound2", volume: 0.8, loop: 1 },
                { libraryId: "sound3", volume: 0.5, loop: 0 }
            ];
            mockMovieClip.getSound.mockReturnValue(sounds);

            mockWorkSpace.getLibrary.mockImplementation((id: string) => ({
                name: `Sound ${id}`,
                id
            }));

            const callOrder: number[] = [];
            mockSoundAreaAddSettingAreaUseCase.mockImplementation(async (idx: number) => {
                await new Promise(resolve => setTimeout(resolve, 5));
                callOrder.push(idx);
            });

            await execute();

            expect(callOrder).toEqual([0, 1, 2]);
        });
    });

    describe("設定エリアの再構成", () => {
        it("既存の設定エリアが削除されてから新しいエリアが追加される", async () => {
            const oldChild1 = document.createElement("div");
            const oldChild2 = document.createElement("div");
            mockElement.appendChild(oldChild1);
            mockElement.appendChild(oldChild2);

            expect(mockElement.children.length).toBe(2);

            await execute();

            // 削除されてから追加される
            expect(mockElement.children.length).toBe(0);
            expect(mockSoundAreaAddSettingAreaUseCase).toHaveBeenCalledTimes(1);
        });

        it("再構成時にMovieClipの現在フレームが参照される", async () => {
            mockMovieClip.currentFrame = 10;

            await execute();

            expect(mockMovieClip.getSound).toHaveBeenCalledWith(10);
        });
    });

    describe("エッジケース", () => {
        it("currentFrameが0の場合", async () => {
            mockMovieClip.currentFrame = 0;

            await execute();

            expect(mockMovieClip.getSound).toHaveBeenCalledWith(0);
        });

        it("currentFrameが負の値の場合", async () => {
            mockMovieClip.currentFrame = -1;

            await execute();

            expect(mockMovieClip.getSound).toHaveBeenCalledWith(-1);
        });

        it("currentFrameが非常に大きい値の場合", async () => {
            mockMovieClip.currentFrame = 9999;

            await execute();

            expect(mockMovieClip.getSound).toHaveBeenCalledWith(9999);
        });

        it("volumeが0の場合", async () => {
            mockSoundObject.volume = 0;

            await execute();

            expect(mockSoundAreaAddSettingAreaUseCase).toHaveBeenCalledWith(
                0,
                "Test Sound",
                expect.objectContaining({ volume: 0 })
            );
        });

        it("volumeが1.0を超える場合", async () => {
            mockSoundObject.volume = 1.5;

            await execute();

            expect(mockSoundAreaAddSettingAreaUseCase).toHaveBeenCalledWith(
                0,
                "Test Sound",
                expect.objectContaining({ volume: 1.5 })
            );
        });

        it("loopが負の値の場合", async () => {
            mockSoundObject.loop = -1;

            await execute();

            expect(mockSoundAreaAddSettingAreaUseCase).toHaveBeenCalledWith(
                0,
                "Test Sound",
                expect.objectContaining({ loop: -1 })
            );
        });

        it("loopが非常に大きい値の場合", async () => {
            mockSoundObject.loop = 999;

            await execute();

            expect(mockSoundAreaAddSettingAreaUseCase).toHaveBeenCalledWith(
                0,
                "Test Sound",
                expect.objectContaining({ loop: 999 })
            );
        });

        it("サウンド名が空文字列の場合", async () => {
            mockSound.name = "";

            await execute();

            expect(mockSoundAreaAddSettingAreaUseCase).toHaveBeenCalledWith(
                0,
                "",
                mockSoundObject
            );
        });

        it("サウンド名が非常に長い場合", async () => {
            mockSound.name = "A".repeat(1000);

            await execute();

            expect(mockSoundAreaAddSettingAreaUseCase).toHaveBeenCalledWith(
                0,
                "A".repeat(1000),
                mockSoundObject
            );
        });

        it("libraryIdが空文字列の場合", async () => {
            mockSoundObject.libraryId = "";

            await execute();

            expect(mockWorkSpace.getLibrary).toHaveBeenCalledWith("");
        });
    });

    describe("複合シナリオ", () => {
        it("再生停止 → サウンドあり → 設定エリア追加", async () => {
            const { timelineHeader } = await import("@/timeline/domain/model/TimelineHeader");
            timelineHeader.stopFlag = true;
            mockMovieClip.selectedDepths = new Map();

            await execute();

            expect(mockSoundAreaAddSettingAreaUseCase).toHaveBeenCalledTimes(1);
        });

        it("複数フレーム間の切り替え", async () => {
            // フレーム1
            mockMovieClip.currentFrame = 1;
            mockMovieClip.getSound.mockReturnValue([mockSoundObject]);

            await execute();

            expect(mockSoundAreaAddSettingAreaUseCase).toHaveBeenCalledTimes(1);

            // フレーム2に切り替え
            vi.clearAllMocks();
            mockMovieClip.currentFrame = 2;
            const soundObject2 = { libraryId: "sound2", volume: 0.8, loop: 1 };
            mockMovieClip.getSound.mockReturnValue([soundObject2]);
            mockWorkSpace.getLibrary.mockReturnValue({ name: "Sound 2", id: "sound2" });

            await execute();

            expect(mockSoundAreaAddSettingAreaUseCase).toHaveBeenCalledTimes(1);
            expect(mockSoundAreaAddSettingAreaUseCase).toHaveBeenCalledWith(
                0,
                "Sound 2",
                soundObject2
            );
        });

        it("選択状態の変化による処理制御", async () => {
            // 選択なし → 処理される
            mockMovieClip.selectedDepths = new Map();
            await execute();
            expect(mockSoundAreaAddSettingAreaUseCase).toHaveBeenCalledTimes(1);

            // 選択あり → 処理されない
            vi.clearAllMocks();
            mockMovieClip.selectedDepths = new Map([[0, [1]]]);
            await execute();
            expect(mockSoundAreaAddSettingAreaUseCase).not.toHaveBeenCalled();
        });
    });

    describe("エラーハンドリング", () => {
        it("soundAreaAddSettingAreaUseCaseでエラーが発生した場合", async () => {
            mockSoundAreaAddSettingAreaUseCase.mockRejectedValue(new Error("Add failed"));

            await expect(execute()).rejects.toThrow("Add failed");
        });

        it("getLibraryでエラーが発生した場合", async () => {
            mockWorkSpace.getLibrary.mockImplementation(() => {
                throw new Error("Library not found");
            });

            await expect(execute()).rejects.toThrow("Library not found");
        });

        it("getSoundでエラーが発生した場合", async () => {
            mockMovieClip.getSound.mockImplementation(() => {
                throw new Error("Sound not found");
            });

            await expect(execute()).rejects.toThrow("Sound not found");
        });

        it("途中でエラーが発生した場合、それ以降の処理は行われない", async () => {
            const sounds = [
                { libraryId: "sound1", volume: 1.0, loop: 0 },
                { libraryId: "sound2", volume: 0.8, loop: 1 },
                { libraryId: "sound3", volume: 0.5, loop: 0 }
            ];
            mockMovieClip.getSound.mockReturnValue(sounds);

            mockWorkSpace.getLibrary.mockImplementation((id: string) => ({
                name: `Sound ${id}`,
                id
            }));

            mockSoundAreaAddSettingAreaUseCase
                .mockResolvedValueOnce(undefined)
                .mockRejectedValueOnce(new Error("Failed at index 1"));

            await expect(execute()).rejects.toThrow("Failed at index 1");

            expect(mockSoundAreaAddSettingAreaUseCase).toHaveBeenCalledTimes(2);
        });
    });

    describe("パフォーマンステスト", () => {
        it("単一サウンドの処理が高速に実行される", async () => {
            const start = performance.now();
            await execute();
            const end = performance.now();
            const duration = end - start;

            // 50ms以内で完了することを期待
            expect(duration).toBeLessThan(50);
        });

        it("複数サウンドの処理が妥当な時間で実行される", async () => {
            const sounds = Array.from({ length: 20 }, (_, i) => ({
                libraryId: `sound${i}`,
                volume: 1.0,
                loop: 0
            }));
            mockMovieClip.getSound.mockReturnValue(sounds);

            mockWorkSpace.getLibrary.mockImplementation((id: string) => ({
                name: `Sound ${id}`,
                id
            }));

            const start = performance.now();
            await execute();
            const end = performance.now();
            const duration = end - start;

            // 100ms以内で完了することを期待
            expect(duration).toBeLessThan(100);
        });
    });

    describe("統合テスト", () => {
        it("完全な再構成フロー", async () => {
            // 既存の要素を追加
            const oldChild = document.createElement("div");
            mockElement.appendChild(oldChild);

            // 複数のサウンドをセットアップ
            const sounds = [
                { libraryId: "bgm1", volume: 0.8, loop: -1 },
                { libraryId: "se1", volume: 1.0, loop: 0 },
                { libraryId: "voice1", volume: 0.9, loop: 0 }
            ];
            mockMovieClip.getSound.mockReturnValue(sounds);

            mockWorkSpace.getLibrary.mockImplementation((id: string) => ({
                name: `Sound ${id}`,
                id
            }));

            await execute();

            // 既存要素が削除されている
            expect(mockElement.children.length).toBe(0);

            // すべてのサウンドが追加されている
            expect(mockSoundAreaAddSettingAreaUseCase).toHaveBeenCalledTimes(3);
            expect(mockSoundAreaAddSettingAreaUseCase).toHaveBeenNthCalledWith(
                1, 0, "Sound bgm1", sounds[0]
            );
            expect(mockSoundAreaAddSettingAreaUseCase).toHaveBeenNthCalledWith(
                2, 1, "Sound se1", sounds[1]
            );
            expect(mockSoundAreaAddSettingAreaUseCase).toHaveBeenNthCalledWith(
                3, 2, "Sound voice1", sounds[2]
            );
        });
    });
});
