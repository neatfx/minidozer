import { app, BrowserWindow } from 'electron'

import config from '../config/development.json'

export class AppWindow {
    private static instance: AppWindow
    private window: BrowserWindow | null

    private constructor() {
        this.window = null
        this.init().then((): void => {
            this.handleAppEvent()
        })
    }

    public static getInstance(): AppWindow {
        if (!AppWindow.instance) {
            AppWindow.instance = new AppWindow()
        }
        return AppWindow.instance
    }

    private async init(): Promise<void> {
        await app.whenReady()
        this.window = new BrowserWindow({
            width: 800,
            height: 600,
            center: true,
            show: false,
            webPreferences: {
                nodeIntegration: true
            }
        })
        this.window.on('ready-to-show', (): (void | null) => this.window && this.window.show())
        this. window.on('closed', (): (void | null) => this.window = null)
    
        const devUrl = 'http://localhost:' + config.server.port
        const prodUrl = 'file://' + __dirname + '/index.html'
        const url = process.env.NODE_ENV === 'development' ? devUrl : prodUrl
        this.window.loadURL(url)
    }
  
    private handleAppEvent(): void {
        app.on('activate', async (): Promise<void> => {
            if (!this.window) {
                await this.init()
            } else {
                if (this.window.isVisible()) {
                    this.window.hide()
                } else {
                    this.window.show()
                }
            }
        })
    }
}
