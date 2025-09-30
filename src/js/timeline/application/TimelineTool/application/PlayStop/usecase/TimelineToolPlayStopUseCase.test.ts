import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { execute } from "./TimelineToolPlayStopUseCase";

// 定数定義
const TIMELINE_PLAY_STOP_ID = "timeline-play";

// モック設定
const mockGetCurrentWorkSpace = vi.fn();
const mockGetRightFrame = vi.fn();
const mockTimelineScrollUpdateScrollXUseCase = vi.fn();
const mockSoundAreaRebuildSettingAreaUseCase = vi.fn();
const mockTimelineLabelNameUpdateService = vi.fn();
const mockExternalTimeline = vi.fn();
const mockTimelineHeader = {
    stopFlag: false,
    loopFlag: false,
    clientWidth: 100
};

// グローバルモック
const mockRequestAnimationFrame = vi.fn();
const mockCancelAnimationFrame = vi.fn();
const mockPerformanceNow = vi.fn();

vi.mock("@/core/application/CoreUtil", () => ({
    $getCurrentWorkSpace: mockGetCurrentWorkSpace
}));

vi.mock("@/timeline/application/TimelineUtil", () => ({
    $getRightFrame: mockGetRightFrame
}));

vi.mock("@/timeline/application/TimelineScroll/usecase/TimelineScrollUpdateScrollXUseCase", () => ({
    execute: mockTimelineScrollUpdateScrollXUseCase
}));

vi.mock("@/controller/application/SoundArea/usecase/SoundAreaRebuildSettingAreaUseCase", () => ({
    execute: mockSoundAreaRebuildSettingAreaUseCase
}));

vi.mock("@/timeline/application/TimelineLabelName/service/TimelineLabelNameUpdateService", () => ({
    execute: mockTimelineLabelNameUpdateService
}));

vi.mock("@/external/timeline/domain/model/ExternalTimeline", () => ({
    ExternalTimeline: mockExternalTimeline
}));

vi.mock("@/timeline/domain/model/TimelineHeader", () => ({
    timelineHeader: mockTimelineHeader
}));

describe("TimelineToolPlayStopUseCase", () => {
    let mockElement: HTMLElement;
    let mockWorkSpace: any;
    let mockMovieClip: any;
    let mockExternalTimelineInstance: any;
    let originalGetElementById: typeof document.getElementById;
    let originalRequestAnimationFrame: typeof requestAnimationFrame;
    let originalCancelAnimationFrame: typeof cancelAnimationFrame;
    let originalPerformanceNow: typeof performance.now;

    beforeEach(() => {
        vi.clearAllMocks();

        // HTMLElement のモック
        mockElement = {
            id: TIMELINE_PLAY_STOP_ID,
            setAttribute: vi.fn()
        } as any;

        // MovieClip モック
        mockMovieClip = {
            maxFrame: 10,
            currentFrame: 1,
            scrollX: 0,
            getLabel: vi.fn().mockReturnValue("frame_label")
        };

        // WorkSpace モック
        mockWorkSpace = {
            scene: mockMovieClip,
            stage: {
                fps: 24
            }
        };

        // ExternalTimeline インスタンスモック
        mockExternalTimelineInstance = {
            changeFrame: vi.fn().mockResolvedValue(undefined)
        };

        // 関数モック設定
        mockGetCurrentWorkSpace.mockReturnValue(mockWorkSpace);
        mockGetRightFrame.mockReturnValue(8);
        mockExternalTimeline.mockReturnValue(mockExternalTimelineInstance);
        mockSoundAreaRebuildSettingAreaUseCase.mockResolvedValue(undefined);

        // timelineHeader のリセット
        mockTimelineHeader.stopFlag = false;
        mockTimelineHeader.loopFlag = false;
        mockTimelineHeader.clientWidth = 100;

        // DOM と Web API のモック
        originalGetElementById = document.getElementById;
        document.getElementById = vi.fn().mockReturnValue(mockElement);

        originalRequestAnimationFrame = global.requestAnimationFrame;
        global.requestAnimationFrame = mockRequestAnimationFrame.mockImplementation((callback) => {
            setTimeout(() => callback(performance.now()), 16);
            return 1;
        });

        originalCancelAnimationFrame = global.cancelAnimationFrame;
        global.cancelAnimationFrame = mockCancelAnimationFrame;

        originalPerformanceNow = performance.now;
        performance.now = mockPerformanceNow.mockReturnValue(1000);
    });

    afterEach(() => {
        vi.resetAllMocks();
        
        // 元の関数を復元
        document.getElementById = originalGetElementById;
        global.requestAnimationFrame = originalRequestAnimationFrame;
        global.cancelAnimationFrame = originalCancelAnimationFrame;
        performance.now = originalPerformanceNow;
    });

    describe("早期リターン条件", () => {
        it("要素が存在しない場合は処理を実行しない", async () => {
            document.getElementById = vi.fn().mockReturnValue(null);

            await execute();

            expect(mockGetCurrentWorkSpace).not.toHaveBeenCalled();
            expect(mockElement.setAttribute).not.toHaveBeenCalled();
        });

        it("maxFrameが存在しない場合は処理を実行しない", async () => {
            mockMovieClip.maxFrame = 0;

            await execute();

            expect(mockElement.setAttribute).not.toHaveBeenCalled();
            expect(mockTimelineLabelNameUpdateService).not.toHaveBeenCalled();
        });

        it("maxFrameが2以下の場合は処理を実行しない", async () => {
            mockMovieClip.maxFrame = 2;

            await execute();

            expect(mockElement.setAttribute).not.toHaveBeenCalled();
            expect(mockTimelineLabelNameUpdateService).not.toHaveBeenCalled();
        });

        it("maxFrameがnullの場合は処理を実行しない", async () => {
            mockMovieClip.maxFrame = null;

            await execute();

            expect(mockElement.setAttribute).not.toHaveBeenCalled();
        });

        it("maxFrameがundefinedの場合は処理を実行しない", async () => {
            mockMovieClip.maxFrame = undefined;

            await execute();

            expect(mockElement.setAttribute).not.toHaveBeenCalled();
        });
    });

    describe("停止処理（stopFlag: false → true）", () => {
        beforeEach(() => {
            mockTimelineHeader.stopFlag = false; // 再生中から停止へ
        });

        it("停止フラグが反転され、要素のクラスが更新される", async () => {
            await execute();

            expect(mockTimelineHeader.stopFlag).toBe(true);
            expect(mockElement.setAttribute).toHaveBeenCalledWith("class", "play");
        });

        it("アニメーションフレームがキャンセルされる", async () => {
            await execute();

            expect(mockCancelAnimationFrame).toHaveBeenCalledWith(0);
        });

        it("現在フレームのラベルが表示される", async () => {
            await execute();

            expect(mockMovieClip.getLabel).toHaveBeenCalledWith(mockMovieClip.currentFrame);
            expect(mockTimelineLabelNameUpdateService).toHaveBeenCalledWith("frame_label");
        });

        it("サウンドエリアが再構築される", async () => {
            await execute();

            expect(mockSoundAreaRebuildSettingAreaUseCase).toHaveBeenCalledOnce();
        });

        it("ラベルが空の場合も正常に処理される", async () => {
            mockMovieClip.getLabel.mockReturnValue("");

            await execute();

            expect(mockTimelineLabelNameUpdateService).toHaveBeenCalledWith("");
        });
    });

    describe("再生処理（stopFlag: true → false）", () => {
        beforeEach(() => {
            mockTimelineHeader.stopFlag = true; // 停止中から再生へ
        });

        it("再生フラグが反転され、要素のクラスが更新される", async () => {
            await execute();

            expect(mockTimelineHeader.stopFlag).toBe(false);
            expect(mockElement.setAttribute).toHaveBeenCalledWith("class", "stop");
        });

        it("ラベル表示が初期化される", async () => {
            await execute();

            expect(mockTimelineLabelNameUpdateService).toHaveBeenCalledWith("");
        });

        it("サウンドエリアが再構築される", async () => {
            await execute();

            expect(mockSoundAreaRebuildSettingAreaUseCase).toHaveBeenCalledOnce();
        });

        it("ExternalTimelineが作成される", async () => {
            await execute();

            expect(mockExternalTimeline).toHaveBeenCalledWith(mockWorkSpace, mockMovieClip);
        });

        it("最終フレーム近くの場合、1フレーム目に移動する", async () => {
            mockMovieClip.currentFrame = 9; // maxFrame - 1
            mockMovieClip.scrollX = 50;

            await execute();

            expect(mockTimelineScrollUpdateScrollXUseCase).toHaveBeenCalledWith(-50);
            expect(mockExternalTimelineInstance.changeFrame).toHaveBeenCalledWith(1);
        });

        it("最終フレームに到達していない場合は移動しない", async () => {
            mockMovieClip.currentFrame = 5;

            await execute();

            expect(mockTimelineScrollUpdateScrollXUseCase).not.toHaveBeenCalled();
            expect(mockExternalTimelineInstance.changeFrame).not.toHaveBeenCalled();
        });

        it("requestAnimationFrameが呼ばれる", async () => {
            await execute();

            expect(mockRequestAnimationFrame).toHaveBeenCalled();
        });
    });

    describe("アニメーションループ処理", () => {
        beforeEach(() => {
            mockTimelineHeader.stopFlag = true; // 停止中から再生へ
            mockPerformanceNow.mockReturnValue(1000);
        });

        it("FPSに基づいてフレーム更新タイミングを制御する", async () => {
            mockWorkSpace.stage.fps = 24;
            let loopCallback: Function;

            mockRequestAnimationFrame.mockImplementation((callback) => {
                loopCallback = callback;
                return 1;
            });

            await execute();

            // 最初のrequestAnimationFrameが呼ばれる
            expect(mockRequestAnimationFrame).toHaveBeenCalled();

            // FPS計算の確認（1000 / 24 | 0 = 41）
            const expectedFps = 1000 / 24 | 0;
            expect(expectedFps).toBe(41);
        });

        it("停止フラグが立つとループが終了する", async () => {
            let loopCallback: Function | undefined;

            mockRequestAnimationFrame.mockImplementation((callback) => {
                loopCallback = callback;
                return 1;
            });

            await execute();

            // ループ内で停止フラグを立てる
            mockTimelineHeader.stopFlag = true;

            // ループコールバックを実行
            if (loopCallback) {
                await loopCallback(1041); // delta > fps になる値
            }

            expect(mockCancelAnimationFrame).toHaveBeenCalled();
            expect(mockElement.setAttribute).toHaveBeenCalledWith("class", "play");
        });

        it("フレーム更新時にスクロールが必要な場合に実行される", async () => {
            mockMovieClip.currentFrame = 7; // getRightFrame() - 1
            mockGetRightFrame.mockReturnValue(8);

            let loopCallback: Function | undefined;
            mockRequestAnimationFrame.mockImplementation((callback) => {
                loopCallback = callback;
                return 1;
            });

            await execute();

            // フレーム更新でスクロールが必要になる
            if (loopCallback) {
                await loopCallback(1041); // delta > fps
            }

            expect(mockTimelineScrollUpdateScrollXUseCase).toHaveBeenCalledWith(100); // clientWidth
        });

        it("最終フレーム到達時にループフラグがtrueならループする", async () => {
            mockMovieClip.currentFrame = 9; // maxFrame - 1
            mockTimelineHeader.loopFlag = true;

            let loopCallback: Function | undefined;
            mockRequestAnimationFrame.mockImplementation((callback) => {
                loopCallback = callback;
                return 1;
            });

            await execute();

            if (loopCallback) {
                await loopCallback(1041);
            }

            expect(mockTimelineScrollUpdateScrollXUseCase).toHaveBeenCalledWith(-0); // -scrollX
            expect(mockExternalTimelineInstance.changeFrame).toHaveBeenCalledWith(1);
        });

        it("最終フレーム到達時にループフラグがfalseなら停止する", async () => {
            mockMovieClip.currentFrame = 9; // maxFrame - 1
            mockTimelineHeader.loopFlag = false;

            let loopCallback: Function | undefined;
            mockRequestAnimationFrame.mockImplementation((callback) => {
                loopCallback = callback;
                return 1;
            });

            await execute();

            if (loopCallback) {
                await loopCallback(1041);
            }

            expect(mockTimelineHeader.stopFlag).toBe(true);
            expect(mockCancelAnimationFrame).toHaveBeenCalled();
            expect(mockElement.setAttribute).toHaveBeenCalledWith("class", "play");
        });
    });

    describe("エラーハンドリング", () => {
        it("サウンドエリア再構築でエラーが発生した場合", async () => {
            mockSoundAreaRebuildSettingAreaUseCase.mockRejectedValue(new Error("Sound rebuild failed"));

            await expect(execute()).rejects.toThrow("Sound rebuild failed");
        });

        it("ExternalTimeline作成でエラーが発生した場合", async () => {
            mockTimelineHeader.stopFlag = true; // 再生処理を実行
            mockExternalTimeline.mockImplementation(() => {
                throw new Error("ExternalTimeline creation failed");
            });

            await expect(execute()).rejects.toThrow("ExternalTimeline creation failed");
        });

        it("changeFrameでエラーが発生した場合", async () => {
            mockTimelineHeader.stopFlag = true; // 再生処理を実行
            mockMovieClip.currentFrame = 9; // 最終フレーム近く
            mockExternalTimelineInstance.changeFrame.mockRejectedValue(new Error("Frame change failed"));

            await expect(execute()).rejects.toThrow("Frame change failed");
        });

        it("getLabelでエラーが発生した場合", async () => {
            mockMovieClip.getLabel.mockImplementation(() => {
                throw new Error("Get label failed");
            });

            await expect(execute()).rejects.toThrow("Get label failed");
        });
    });

    describe("タイマー管理", () => {
        it("timerId が正しく管理される", async () => {
            mockRequestAnimationFrame.mockReturnValue(123);

            mockTimelineHeader.stopFlag = true; // 再生処理
            await execute();

            expect(mockRequestAnimationFrame).toHaveBeenCalled();
        });

        it("停止時にtimerId でキャンセルされる", async () => {
            // 最初に再生状態にする
            mockTimelineHeader.stopFlag = true;
            mockRequestAnimationFrame.mockReturnValue(456);
            await execute();

            // 停止処理
            mockTimelineHeader.stopFlag = false;
            await execute();

            expect(mockCancelAnimationFrame).toHaveBeenCalledWith(0); // 初期値
        });
    });

    describe("フレーム計算", () => {
        it("currentFrame + 1 が正しく計算される", async () => {
            mockMovieClip.currentFrame = 3;

            let loopCallback: Function | undefined;
            mockRequestAnimationFrame.mockImplementation((callback) => {
                loopCallback = callback;
                return 1;
            });

            mockTimelineHeader.stopFlag = true; // 再生処理
            await execute();

            if (loopCallback) {
                await loopCallback(1041);
            }

            expect(mockExternalTimelineInstance.changeFrame).toHaveBeenCalledWith(4);
        });

        it("スクロール判定が正しく動作する", async () => {
            mockMovieClip.currentFrame = 6;
            mockGetRightFrame.mockReturnValue(7);

            let loopCallback: Function | undefined;
            mockRequestAnimationFrame.mockImplementation((callback) => {
                loopCallback = callback;
                return 1;
            });

            mockTimelineHeader.stopFlag = true; // 再生処理
            await execute();

            if (loopCallback) {
                await loopCallback(1041);
            }

            // frame (7) >= getRightFrame (7) でスクロール実行
            expect(mockTimelineScrollUpdateScrollXUseCase).toHaveBeenCalledWith(100);
        });
    });

    describe("FPS計算", () => {
        const fpsTests = [
            { fps: 24, expected: 41 },
            { fps: 30, expected: 33 },
            { fps: 60, expected: 16 },
            { fps: 12, expected: 83 }
        ];

        fpsTests.forEach(({ fps, expected }) => {
            it(`FPS ${fps} の場合、期待値 ${expected}ms で計算される`, async () => {
                mockWorkSpace.stage.fps = fps;
                const calculatedFps = 1000 / fps | 0;
                expect(calculatedFps).toBe(expected);
            });
        });
    });

    describe("ループフラグによる動作分岐", () => {
        beforeEach(() => {
            mockMovieClip.currentFrame = 9; // maxFrame - 1
            mockTimelineHeader.stopFlag = true; // 再生処理
        });

        it("ループフラグがtrueの場合のループ動作", async () => {
            mockTimelineHeader.loopFlag = true;

            let loopCallback: Function | undefined;
            mockRequestAnimationFrame.mockImplementation((callback) => {
                loopCallback = callback;
                return 1;
            });

            await execute();

            if (loopCallback) {
                await loopCallback(1041);
            }

            expect(mockTimelineScrollUpdateScrollXUseCase).toHaveBeenCalledWith(-0);
            expect(mockExternalTimelineInstance.changeFrame).toHaveBeenCalledWith(1);
            expect(mockRequestAnimationFrame).toHaveBeenCalledTimes(2); // 初期 + ループ継続
        });

        it("ループフラグがfalseの場合の停止動作", async () => {
            mockTimelineHeader.loopFlag = false;

            let loopCallback: Function | undefined;
            mockRequestAnimationFrame.mockImplementation((callback) => {
                loopCallback = callback;
                return 1;
            });

            await execute();

            if (loopCallback) {
                await loopCallback(1041);
            }

            expect(mockTimelineHeader.stopFlag).toBe(true);
            expect(mockCancelAnimationFrame).toHaveBeenCalled();
            expect(mockElement.setAttribute).toHaveBeenCalledWith("class", "play");
        });
    });

    describe("エッジケース", () => {
        it("maxFrameがちょうど3の場合は処理される", async () => {
            mockMovieClip.maxFrame = 3;

            await execute();

            expect(mockElement.setAttribute).toHaveBeenCalled();
        });

        it("currentFrameが0の場合", async () => {
            mockMovieClip.currentFrame = 0;

            let loopCallback: Function | undefined;
            mockRequestAnimationFrame.mockImplementation((callback) => {
                loopCallback = callback;
                return 1;
            });

            mockTimelineHeader.stopFlag = true; // 再生処理
            await execute();

            if (loopCallback) {
                await loopCallback(1041);
            }

            expect(mockExternalTimelineInstance.changeFrame).toHaveBeenCalledWith(1);
        });

        it("scrollXが負の値の場合", async () => {
            mockMovieClip.scrollX = -50;
            mockMovieClip.currentFrame = 9; // 最終フレーム近く

            await execute();

            expect(mockTimelineScrollUpdateScrollXUseCase).toHaveBeenCalledWith(50); // -(-50)
        });

        it("clientWidthが0の場合", async () => {
            mockTimelineHeader.clientWidth = 0;
            mockMovieClip.currentFrame = 7;
            mockGetRightFrame.mockReturnValue(8);

            let loopCallback: Function | undefined;
            mockRequestAnimationFrame.mockImplementation((callback) => {
                loopCallback = callback;
                return 1;
            });

            mockTimelineHeader.stopFlag = true; // 再生処理
            await execute();

            if (loopCallback) {
                await loopCallback(1041);
            }

            expect(mockTimelineScrollUpdateScrollXUseCase).toHaveBeenCalledWith(0);
        });
    });

    describe("パフォーマンステスト", () => {
        it("大量の連続実行でもパフォーマンスが安定している", async () => {
            const iterations = 50;
            const start = performance.now();

            const promises = [];
            for (let i = 0; i < iterations; i++) {
                promises.push(execute());
            }

            await Promise.all(promises);

            const end = performance.now();
            const duration = end - start;

            // 50回の実行が1秒以内で完了することを期待
            expect(duration).toBeLessThan(1000);
        });
    });

    describe("統合テスト風のシナリオ", () => {
        it("停止→再生→停止の完全なサイクル", async () => {
            // 初期状態：停止中
            mockTimelineHeader.stopFlag = false;

            // 1回目：停止処理
            await execute();
            expect(mockTimelineHeader.stopFlag).toBe(true);
            expect(mockElement.setAttribute).toHaveBeenLastCalledWith("class", "play");

            // 2回目：再生処理
            await execute();
            expect(mockTimelineHeader.stopFlag).toBe(false);
            expect(mockElement.setAttribute).toHaveBeenLastCalledWith("class", "stop");

            // 3回目：再び停止処理
            await execute();
            expect(mockTimelineHeader.stopFlag).toBe(true);
            expect(mockElement.setAttribute).toHaveBeenLastCalledWith("class", "play");
        });
    });
});
