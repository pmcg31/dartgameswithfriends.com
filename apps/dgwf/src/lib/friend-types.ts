export type FriendActionData = {
  requesterId: string;
  createdAt: string;
};

export type FriendRequestActionData = {
  requesterId: string;
  addresseeId: string;
};

export type UnfriendActionData = {
  playerId1: string;
  playerId2: string;
};

export type InviteVChatData = {
  requesterId: string;
  addresseeId: string;
};
