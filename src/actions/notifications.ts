'use server'

import { createClient } from "../supabase/server"


// @ts-ignore
async function sendPushNotification({ expoPushToken, title, body }: { expoPushToken: string, title: string, body: string }) {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title,
        body,
        data: { someData: 'goes here' },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
}
export const getUserNotificationToken = async (userId: string, status: string) => {
    const supabase = createClient()
    // @ts-ignore
    const { data, error } = await supabase.from('users').select('expo_notification_token').eq('id', userId).single()
}
export const sendNotification = async (userId: string) => {
    // @ts-ignore
    const tokenData = await getUserNotificationToken(userId)
    // @ts-ignore
    if (!tokenData.expo_notification_token) { return }
    // @ts-ignore
    await sendPushNotification({ expoPushToken: tokenData.expo_notification_token, title: 'your order status', body: `your order is now${status}` })
}