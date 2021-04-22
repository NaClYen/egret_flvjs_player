class FlvPlayer extends eui.Component {
    private playerEntity: flvjs.Player;
    private video: HTMLVideoElement;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private image: eui.Image;

    public constructor() {
        super();

        this.init();
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoved, this);
    }

    private init() {
        if (this.video) return;

        // init video
        this.video = document.createElement("video");

        // init canvas
        this.canvas = document.createElement("canvas");

        // cache context
        this.ctx = this.canvas.getContext("2d");

        // listen event to update data
        this.addEventListener(egret.Event.ENTER_FRAME, this.loop, this);

        // for debug
        // document.body.appendChild(this.video);
        // document.body.appendChild(this.canvas);

        // init image component
        let img = new eui.Image();
        this.addChild(img);
        this.image = img;

        // extend to the whole parent component
        img.right = 0;
        img.left = 0;
        img.top = 0;
        img.bottom = 0;
    }

    private onRemoved() {
        this.releasePlayerEntity();
    }

    private releasePlayerEntity() {
        if (this.playerEntity) {
            this.playerEntity.unload();
            this.playerEntity.detachMediaElement();
            this.playerEntity.destroy();
            this.playerEntity = null;
        }
    }

    public play(url: string) {
        if (!this.image) {
            console.error(`尚未初始化!!`);
            return;
        }

        // release older one
        this.releasePlayerEntity();

        this.playerEntity = flvjs.createPlayer({
            type: "flv",
            isLive: false, // 如果來源為串流, 必須設為 true
            hasVideo: true, // 根據來源設定
            hasAudio: true, // 根據來源設定
            url
        });

        this.playerEntity.attachMediaElement(this.video);
        this.playerEntity.load();
        this.video.play();
    }

    public pause() {
        if (this.video) {
            this.video.pause();
        }
    }

    public resume() {
        if (this.video) {
            this.video.play();
        }
    }

    public get muted() {
        return this.playerEntity ? this.playerEntity.muted : false;
    }

    public set muted(val: boolean) {
        if (this.playerEntity) {
            this.playerEntity.muted = val;
        }
    }

    private loop() {
        if (this.playerEntity) {
            this.syncVideoToCanvas();
            this.syncCanvasToImage();
        }
    }

    private syncVideoToCanvas() {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        let ctx = this.ctx;
        ctx.drawImage(this.video, 0, 0, this.width, this.height);
    }

    private syncCanvasToImage() {
        const canvasToTexture = () => {
            const texture = new egret.Texture();
            texture.bitmapData = new egret.BitmapData(this.canvas);
            return texture;
        };

        this.image.texture = canvasToTexture();
    }
}
