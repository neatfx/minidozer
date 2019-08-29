import { app, Tray, Menu } from 'electron'
import { resolve } from 'path'

export class AppTray {
    private static instance: AppTray
    private tray: Tray | null

    private constructor() {
        this.tray = null
        this.init()
    }

    public static getInstance(): AppTray {
        if (!AppTray.instance) {
            AppTray.instance = new AppTray()
        }
        return AppTray.instance
    }

    private async init(): Promise<void> {
        await app.whenReady()
        this.tray = new Tray(resolve(__dirname, 'icons/tray.png'))
        this.tray.setToolTip('Minidozer')
        this.tray.setIgnoreDoubleClickEvents(true)
        this.setMenu(this.tray)
        this.setDropEvent(this.tray)
    }

    private setDropEvent(tray: Tray): void {
        tray.on('drop-text', (event: Electron.Event, text: string): void => {
        })
  
        tray.on('drop-files', (event: Electron.Event, files: string[]): void => {
        })
    }

    private setMenu(tray: Tray): void {
        const contextMenu = Menu.buildFromTemplate([
            {
                label: 'About Minidozer',
                click: (): void => {}
            },
            {
                type: 'separator'
            },
            {
                label: 'Quit Minidozer',
                click: (): void => app.quit()
            }
        ])
        tray.setContextMenu(contextMenu)
        tray.on('click', (): void => {
            tray.popUpContextMenu()
        })
    }
}
