export default class Loop {

    private _fps = 12;
    private _changeEvery = 1000 / this._fps;
    private _elapsed = this._changeEvery;
    private _startStamp: number | null = null;

    callback: () => void;
    stopCondition: () => boolean;
    finalize: () => void;

    constructor(callback: () => void, stopCondition: () => boolean, finalize: () => void, fps = undefined) {
        this.callback = callback;
        this.stopCondition = stopCondition;
        this.finalize = finalize;
        this._fps = fps || this._fps;
    }

    start() {
        requestAnimationFrame(this.doLoop);
    }

    private doLoop = (timeStamp: number) => {
        if (!this._startStamp)
            this._startStamp = timeStamp;
        let dt = timeStamp - this._startStamp!;
        this._startStamp = timeStamp;

        this.preCallBack(dt);

        if (this.stopCondition())
            this.finalize();
        else
            requestAnimationFrame(this.doLoop);
    }

    private preCallBack = (dt: number) => {
        this._elapsed += dt;
        if (this._elapsed > this._changeEvery) {
            this._elapsed = 0;
            this.callback();
        }
    }
}