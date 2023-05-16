export type FriendActionData = {
  requesterId: string;
  createdAt: string;
};

export type FriendActionClickedCallback = (data: FriendActionData) => void;
