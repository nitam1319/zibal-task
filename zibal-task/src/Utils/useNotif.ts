import { notification } from 'antd'
type NotificationType = 'success' | 'info' | 'warning' | 'error'

export default function useNotif () {
  const [api, contextHolderNotification] = notification.useNotification()
  const openNotif = (
    type: NotificationType,
    message: string,
    description: string
  ) => {
    api[type]({
      message: message,
      description: description
    })
  }
  return {openNotif, contextHolderNotification}
}
