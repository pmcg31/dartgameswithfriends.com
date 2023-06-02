import Layout from '@/src/components/ui/layout/layout';
import {
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from '@chakra-ui/react';
import { useUser, RedirectToSignIn } from '@clerk/clerk-react';
import { BsPeople } from 'react-icons/bs';
import { trpc } from '@/src/utils/trpc';
import PageHeading from '@/src/components/ui/common/page-heading';
import FriendsList from '@/src/components/ui/friend/friends-list';
import IncomingFriendRequests from '@/src/components/ui/friend/incoming-friend-requests';
import OutgoingFriendRequests from '@/src/components/ui/friend/outgoing-friend-requests';
import { useToast } from '@chakra-ui/react';
import FindFriends from '@/src/components/ui/friend/find-friends';
import { useWsQueryTracker } from '@/src/lib/websocket/use-ws-query-tracker';
import router from 'next/router';

export default function Friends() {
  // Use the websocket query tracker
  const { announceMutation } = useWsQueryTracker();

  const toast = useToast();
  const { isLoaded, isSignedIn, user } = useUser();

  // Set up mutations for create/accept/reject/delete
  // friend request
  const createFriendRequestM = trpc.createFriendRequest.useMutation();
  const acceptFriendRequestM = trpc.acceptFriendRequest.useMutation();
  const rejectFriendRequestM = trpc.rejectFriendRequest.useMutation();
  const deleteFriendRequestM = trpc.deleteFriendRequest.useMutation();

  // Set up mutation for delete friend
  const deleteFriendM = trpc.deleteFriend.useMutation();

  // Set up mutation for create vconf
  const createVConfM = trpc.createVConf.useMutation();

  let content: JSX.Element | null = null;
  if (isLoaded) {
    if (isSignedIn) {
      content = (
        <Flex
          width={'100dvw'}
          maxW={'100ch'}
          p={'1rem'}
          color={'white'}
          direction={'column'}
          gap={'1rem'}
        >
          <PageHeading icon={<BsPeople />} heading='Friends' />
          <Tabs variant={'line'} size={'sm'}>
            <TabList>
              <Tab>Friend List</Tab>
              <Tab>Incoming Requests</Tab>
              <Tab>Outgoing Requests</Tab>
              <Tab>Find Friends</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <FriendsList
                  playerId={user.id}
                  onUnfriendClicked={({ playerId1, playerId2 }) => {
                    deleteFriendM.mutate(
                      {
                        playerId1,
                        playerId2
                      },
                      {
                        onError: (error) => {
                          console.log(
                            `delete friend error: ${JSON.stringify(error)}`
                          );
                          toast({
                            description:
                              'Oops! Something went wrong and your friend could not be removed'
                          });
                        },
                        onSuccess: () => {
                          toast({
                            description: 'Your friend has been removed'
                          });

                          // Announce the mutation
                          announceMutation({
                            deleteFriend: { playerId1, playerId2 }
                          });
                        }
                      }
                    );
                  }}
                  onInviteVChatClicked={({ requesterId, addresseeId }) => {
                    createVConfM.mutate(
                      { requesterId, addresseeId },
                      {
                        onError: (error) => {
                          console.log(
                            `create vconf error: ${JSON.stringify(error)}`
                          );
                          toast({
                            description:
                              'Oops! Something went wrong and your chat invite could not be sent'
                          });
                        },
                        onSuccess: (data) => {
                          // Announce the mutation
                          announceMutation({
                            createVConf: {
                              id: data.id,
                              playerId1: requesterId,
                              playerId2: addresseeId
                            }
                          });

                          // Go to the chat page
                          router.push({ pathname: `/vconf/${data.id}` });
                        }
                      }
                    );
                  }}
                />
              </TabPanel>
              <TabPanel>
                <IncomingFriendRequests
                  playerId={user.id}
                  onAcceptClicked={(data) => {
                    acceptFriendRequestM.mutate(
                      {
                        requesterId: data.requesterId,
                        addresseeId: user.id
                      },
                      {
                        onError: (error) => {
                          console.log(
                            `accept friend request error: ${JSON.stringify(
                              error
                            )}`
                          );
                          toast({
                            description:
                              'Oops! Something went wrong and your friend request could not be accepted'
                          });
                        },
                        onSuccess: () => {
                          // Announce the mutation
                          announceMutation({
                            acceptFriendRequest: {
                              requesterId: data.requesterId,
                              addresseeId: user.id
                            }
                          });
                        }
                      }
                    );
                  }}
                  onRejectClicked={(data) => {
                    toast({
                      description: 'Your friend request has been rejected'
                    });

                    rejectFriendRequestM.mutate(
                      {
                        requesterId: data.requesterId,
                        addresseeId: user.id
                      },
                      {
                        onError: (error) => {
                          console.log(
                            `Reject friend request error: ${JSON.stringify(
                              error
                            )}`
                          );
                          toast({
                            description:
                              'Oops! Something went wrong and your friend request could not be rejected'
                          });
                        },
                        onSuccess: () => {
                          // Announce the mutation
                          announceMutation({
                            rejectFriendRequest: {
                              requesterId: data.requesterId,
                              addresseeId: user.id
                            }
                          });
                        }
                      }
                    );
                  }}
                  onBlockClicked={(data) => {
                    console.log(
                      `block clicked: data is: ${JSON.stringify(data)}`
                    );
                  }}
                />
              </TabPanel>
              <TabPanel>
                <OutgoingFriendRequests
                  playerId={user.id}
                  onCancelClicked={({ requesterId, addresseeId }) => {
                    deleteFriendRequestM.mutate(
                      {
                        requesterId,
                        addresseeId
                      },
                      {
                        onError: (error) => {
                          console.log(
                            `Delete friend request error: ${JSON.stringify(
                              error
                            )}`
                          );
                          toast({
                            description:
                              'Oops! Something went wrong and your friend request could not be rejected'
                          });
                        },
                        onSuccess: () => {
                          toast({
                            description: 'Your friend request has been canceled'
                          });

                          // Announce the mutation
                          announceMutation({
                            deleteFriendRequest: {
                              requesterId,
                              addresseeId
                            }
                          });
                        }
                      }
                    );
                  }}
                />
              </TabPanel>
              <TabPanel>
                <FindFriends
                  playerId={user.id}
                  limit={5}
                  onAddFriendClicked={({ requesterId, addresseeId }) => {
                    createFriendRequestM.mutate(
                      {
                        requesterId,
                        addresseeId
                      },
                      {
                        onError: (error) => {
                          console.log(
                            `Create friend request error: ${JSON.stringify(
                              error
                            )}`
                          );
                          toast({
                            description:
                              'Oops! Something went wrong and your friend request could not be sent'
                          });
                        },
                        onSuccess: () => {
                          toast({
                            description: 'Your friend request has been sent!'
                          });

                          // Announce the mutation
                          announceMutation({
                            createFriendRequest: {
                              requesterId,
                              addresseeId
                            }
                          });
                        }
                      }
                    );
                  }}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
      );
    } else {
      // Not signed in; redirect
      return (
        <RedirectToSignIn
          afterSignInUrl={window.location.href}
          afterSignUpUrl={window.location.href}
        />
      );
    }
  }

  return <Layout title='Friends'>{content}</Layout>;
}
