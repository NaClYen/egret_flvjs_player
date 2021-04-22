class Main extends eui.UILayer {
    protected createChildren(): void {
        super.createChildren();

        console.log(`flvjs.isSupported: ${flvjs.isSupported()}`);

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        });

        egret.lifecycle.onPause = () => {
            // egret.ticker.pause();
        };

        egret.lifecycle.onResume = () => {
            // egret.ticker.resume();
        };

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

        this.runGame().catch((e) => {
            console.log(e);
        });
    }

    private async runGame() {
        await this.loadResource();
        this.createGameScene();
    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await this.loadTheme();
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        } catch (e) {
            console.error(e);
        }
    }

    private loadTheme() {
        return new Promise<void>((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(
                eui.UIEvent.COMPLETE,
                () => {
                    resolve();
                },
                this
            );
        });
    }

    /**
     * 创建场景界面
     * Create scene interface
     */
    protected createGameScene(): void {
        this.initFlvPlayer();

        let btnGroup = new eui.Group();
        btnGroup.left = 0;
        btnGroup.right = 0;
        btnGroup.layout = new eui.HorizontalLayout();
        this.addChild(btnGroup);

        const createButton = (title: string): eui.Button => {
            const btn = new eui.Button();
            btn.label = title;
            btnGroup.addChild(btn);
            return btn;
        };

        createButton("play").addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPlay, this);
        createButton("pause").addEventListener(egret.TouchEvent.TOUCH_TAP, this.flvPlayer.pause, this.flvPlayer);
        createButton("resume").addEventListener(egret.TouchEvent.TOUCH_TAP, this.flvPlayer.resume, this.flvPlayer);
    }

    private onPlay() {
        this.flvPlayer.play("https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/flv/xgplayer-demo-360p.flv");
    }

    private flvPlayer: FlvPlayer;

    private initFlvPlayer() {
        this.flvPlayer = new FlvPlayer();
        this.flvPlayer.left = 20;
        this.flvPlayer.top = 30;
        this.flvPlayer.right = 40;
        this.flvPlayer.bottom = 50;
        this.addChild(this.flvPlayer);
    }
}
