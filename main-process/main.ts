import { app } from 'electron'

import { AppWindow } from './AppWindow'
import { AppMenu } from './AppMenu'
import { AppTray } from './AppTray'

AppWindow.getInstance()
AppMenu.getInstance()
AppTray.getInstance()

app.on('window-all-closed', (): void => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
