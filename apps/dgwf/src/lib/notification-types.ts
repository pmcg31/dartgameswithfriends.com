export type SystemNotificationData = {
  subject: string;
  body: string;
};

export type LinkNotificationData = {
  subject: string;
  url: string;
};

export type FriendRequestNotificationData = {
  from: string;
  createdAt: string;
};

export type Notification = {
  kind: string;
  data:
    | SystemNotificationData
    | LinkNotificationData
    | FriendRequestNotificationData;
};

export type ToggleNotificationReadData = {
  notificationId: number;
  isNew: boolean;
};

export type DeleteNotificationData = {
  notificationId: number;
};

export type ToggleNotificationReadClickedCallback = (
  data: ToggleNotificationReadData
) => void;

export type DeleteNotificationClickedCallback = (
  data: DeleteNotificationData
) => void;
