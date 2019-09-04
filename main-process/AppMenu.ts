import { app, Menu, MenuItem, dialog, BrowserWindow } from 'electron'

interface MenuTemplate {
    label: string;
    submenu: Menu;
}

export class AppMenu {
    private static instance: AppMenu

    private constructor() {
        this.init()
    }

    public static getInstance(): AppMenu {
        if (!AppMenu.instance) {
            AppMenu.instance = new AppMenu()
        }
        return AppMenu.instance
    }

    private createAppMenuTemplate(): MenuTemplate {
        const menu: Menu = new Menu()

        menu.append(
            new MenuItem({
                label: 'About Minidozer',
                role: 'about'
            })
        )
        menu.append(
            new MenuItem({
                label: 'Check for Updates...',
                click: (menuItem, browserWindow): void => {
                    if (browserWindow) {
                        const options: Electron.MessageBoxOptions = {
                            type: 'info',
                            message: 'Checking for updates...',
                            detail: '',
                            buttons: ['Cancel']
                        }
                        dialog.showMessageBox(browserWindow, options)
                    }
                }
            })
        )
        menu.append(
            new MenuItem({
                type: 'separator'
            })
        )
        menu.append(
            new MenuItem({
                label: 'Preferences...',
                click: (): void => {
                    let preferenceWindow: Electron.BrowserWindow | null = new BrowserWindow({
                        title: 'Preferences',
                        maximizable: false,
                        width: 400,
                        height: 500
                    })
                    preferenceWindow.on('closed', (): null => preferenceWindow = null)
                }
            })
        )
        menu.append(
            new MenuItem({
                type: 'separator'
            })
        )
        menu.append(
            new MenuItem({
                label: 'Quit Minidozer',
                click(): void {
                    app.quit()
                }
            })
        )

        return {
            label: app.getName(),
            submenu: menu
        }
    }

    private createViewMenuTemplate(): MenuTemplate {
        const menu = new Menu()

        menu.append(
            new MenuItem({
                role: 'reload'
            })
        )
        menu.append(
            new MenuItem({
                role: 'forceReload'
            })
        )
        menu.append(
            new MenuItem({
                role: 'toggleDevTools'
            })
        )
        menu.append(
            new MenuItem({
                type: 'separator'
            })
        )
        menu.append(
            new MenuItem({
                role: 'togglefullscreen'
            })
        )

        return {
            label: 'View',
            submenu: menu
        }
    }

    private init(): void {
        const template: Menu = Menu.buildFromTemplate([
            this.createAppMenuTemplate(),
            this.createViewMenuTemplate()
        ])
        Menu.setApplicationMenu(template)
    }
}
