import Layout from '@/src/components/ui/layout/layout';
import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { trpc } from '@/src/utils/trpc';
import { useWsQueryTracker } from '@/src/lib/websocket/use-ws-query-tracker';
import { useUser, RedirectToSignIn } from '@clerk/clerk-react';
import Player from '@/src/components/ui/common/player';

export default function VConf() {
  // Use the websocket query tracker
  const { announceMutation } = useWsQueryTracker();

  const { isLoaded, isSignedIn, user } = useUser();

  const router = useRouter();

  // Get conference id from url
  const confId = router.query.id as string;

  // Get conference details from db
  const getVConfQ = trpc.getVConf.useQuery(
    { id: confId },
    { enabled: confId !== undefined }
  );

  // Set up mutation for updating conference
  const updateVConfM = trpc.updateVConf.useMutation();

  // Make sure this user should be here
  const [isUserIncluded, setIsUserIncluded] = useState<boolean>(true);
  const isUserASide = useRef<boolean>(false);
  useEffect(() => {
    if (isLoaded && isSignedIn && getVConfQ.isSuccess && getVConfQ.data) {
      console.log(
        `user: ${user.id} a: ${getVConfQ.data.playerAId} b: ${
          getVConfQ.data.playerBId
        } isASide: ${user.id === getVConfQ.data.playerAId}`
      );
      if (
        user.id !== getVConfQ.data.playerAId &&
        user.id !== getVConfQ.data.playerBId
      ) {
        // Not supposed to be here
        setIsUserIncluded(false);
      } else {
        // User is supposed to be here; set
        // whether this is the A side user
        setIsUserIncluded(true);
        isUserASide.current = user.id === getVConfQ.data.playerAId;
      }
    }
  }, [getVConfQ.isSuccess, getVConfQ.data, isLoaded, isSignedIn, user]);

  const pc = useRef<RTCPeerConnection | null>(null);
  const candidates = useRef<string[]>([]);
  const selfView = useRef<HTMLVideoElement>(null);
  const remoteView = useRef<HTMLVideoElement>(null);

  const start = useCallback(async () => {
    try {
      const constraints = { audio: true, video: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      for (const track of stream.getTracks()) {
        if (pc.current) {
          pc.current.addTrack(track, stream);
        }
      }
      if (selfView.current) {
        selfView.current.srcObject = stream;
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const makingOffer = useRef<boolean>(false);
  useEffect(() => {
    if (isUserIncluded && !pc.current) {
      const config = {
        iceServers: [
          { urls: 'stun:stun.dartgameswithfriends.com:5349' },
          {
            urls: 'turn:turn.dartgameswithfriends.com:5349',
            username: 'test_user',
            credential: 'password'
          }
        ]
      };

      pc.current = new RTCPeerConnection(config);

      pc.current.ontrack = ({ track, streams }) => {
        console.log('We are on track!');
        track.onunmute = () => {
          if (remoteView.current) {
            if (remoteView.current.srcObject) {
              return;
            }
            remoteView.current.srcObject = streams[0];
          }
        };
      };

      pc.current.onnegotiationneeded = async () => {
        if (pc.current) {
          try {
            // We are in the process of making an offer
            makingOffer.current = true;

            // Set local description based on
            // current connection state
            await pc.current.setLocalDescription();

            // Set up data for database update
            // depending on whether this is the A or
            // B side user
            let data: { descriptionA?: string; descriptionB?: string } | null =
              null;
            if (pc.current.localDescription) {
              const descriptionStr = JSON.stringify(
                pc.current.localDescription
              );
              if (isUserASide.current) {
                data = { descriptionA: descriptionStr };
              } else {
                data = { descriptionB: descriptionStr };
              }
            }

            // Update database
            if (data !== null) {
              console.log(
                `128: Updating vconf: isUserASide: ${
                  isUserASide.current
                } id: ${confId} data: ${Object.keys(data)}`
              );
              updateVConfM.mutate(
                { id: confId, ...data },
                {
                  onError: (error) => {
                    console.log(`Update vconf error: ${JSON.stringify(error)}`);
                  },
                  onSuccess: () => {
                    console.log(`140: Update vconf success`);
                    // Announce the mutation
                    announceMutation({
                      updateVConf: { id: confId }
                    });
                  }
                }
              );
            }
          } catch (err) {
            console.error(err);
          } finally {
            // Completed process of making offer
            makingOffer.current = false;
          }
        }
      };

      pc.current.onicecandidate = ({ candidate }) => {
        // Update database
        // signaler.send({ candidate });
        if (candidate) {
          // Add stringified candidate to the list of candidates
          // and stringify the whole array
          candidates.current.push(JSON.stringify(candidate));
          const candidatesStr = JSON.stringify(candidates.current);

          // Set up data for database update
          // depending on whether this is the A or
          // B side user
          let data: { candidatesA?: string; candidatesB?: string } | null =
            null;
          if (isUserASide.current) {
            data = { candidatesA: candidatesStr };
          } else {
            data = { candidatesB: candidatesStr };
          }

          // Update database
          if (data !== null) {
            console.log(
              `180: Updating vconf: isUserASide: ${
                isUserASide.current
              } id: ${confId} data: ${Object.keys(data)}`
            );
            updateVConfM.mutate(
              { id: confId, ...data },
              {
                onError: (error) => {
                  console.log(`Update vconf error: ${JSON.stringify(error)}`);
                },
                onSuccess: () => {
                  console.log(`192: Update vconf success`);
                  // Announce the mutation
                  announceMutation({
                    updateVConf: { id: confId }
                  });
                }
              }
            );
          }
        }
      };

      pc.current.oniceconnectionstatechange = () => {
        if (pc.current) {
          if (pc.current.iceConnectionState === 'failed') {
            pc.current.restartIce();
          }
        }
      };

      // Initiate connection
      start();

      // Close the connection on unload
      // return () => {
      //   pc.current?.close();
      // };
    }
  }, [isUserIncluded, updateVConfM, confId, announceMutation, start]);

  const remoteDescriptionStrAdded = useRef<string | null>(null);
  const candidatesAdded = useRef<string[]>([]);
  useEffect(() => {
    let ignoreOffer = false;

    async function updateDescriptions(description: RTCSessionDescription) {
      console.log('updateDescriptions');
      if (pc.current) {
        console.log(`setRemoteDescription: type: ${description.type}`);
        await pc.current.setRemoteDescription(description);
        if (description.type === 'offer') {
          await pc.current.setLocalDescription();
          const descriptionStr = JSON.stringify(pc.current.localDescription);

          let data = null;
          if (isUserASide.current) {
            data = { descriptionA: descriptionStr };
          } else {
            data = { descriptionB: descriptionStr };
          }
          console.log(
            `246: Updating vconf: isUserASide: ${
              isUserASide.current
            } id: ${confId} data: ${Object.keys(data)}`
          );
          updateVConfM.mutate(
            { id: confId, ...data },
            {
              onError: (error) => {
                console.log(`Update vconf error: ${JSON.stringify(error)}`);
              },
              onSuccess: () => {
                console.log(`258: Update vconf success`);
                // Announce the mutation
                announceMutation({
                  updateVConf: { id: confId }
                });
              }
            }
          );
        }
      }
    }

    async function addCandidate(candidate: RTCIceCandidate) {
      console.log('addCandidate');
      if (pc.current) {
        try {
          console.log(`addIceCandidate: type: ${candidate.type}`);
          await pc.current.addIceCandidate(candidate);
        } catch (err) {
          if (!ignoreOffer) {
            throw err;
          }
        }
      }
    }

    let remoteDescription: RTCSessionDescription | null = null;
    let remoteDescriptionStr: string | null = null;
    let remoteCandidates: string[] | null = null;
    if (getVConfQ.isSuccess && getVConfQ.data) {
      // Get description and/or candidates from
      // the other side
      if (isUserASide.current) {
        if (getVConfQ.data.descriptionB) {
          remoteDescriptionStr = getVConfQ.data.descriptionB;
          remoteDescription = JSON.parse(remoteDescriptionStr);
        }
        if (getVConfQ.data.candidatesB) {
          remoteCandidates = JSON.parse(getVConfQ.data.candidatesB);
        }
      } else {
        if (getVConfQ.data.descriptionA) {
          remoteDescriptionStr = getVConfQ.data.descriptionA;
          remoteDescription = JSON.parse(remoteDescriptionStr);
        }
        if (getVConfQ.data.candidatesA) {
          remoteCandidates = JSON.parse(getVConfQ.data.candidatesA);
        }
      }
    }

    console.log(
      `remote description: ${
        remoteDescription ? 'yes' : 'no'
      } remote candidates: ${
        remoteCandidates ? `yes, ${remoteCandidates.length}` : 'no'
      } pc.current: ${pc.current ? 'yes' : 'no'}`
    );

    if (pc.current) {
      if (
        remoteDescription &&
        remoteDescriptionStr !== remoteDescriptionStrAdded.current
      ) {
        const offerCollision =
          remoteDescription.type === 'offer' &&
          (makingOffer.current || pc.current.signalingState !== 'stable');

        ignoreOffer = !isUserASide && offerCollision;
        if (!ignoreOffer) {
          updateDescriptions(remoteDescription);
          remoteDescriptionStrAdded.current = remoteDescriptionStr;
        }
      }

      if (remoteCandidates) {
        remoteCandidates.forEach((remoteCandidate) => {
          if (!candidatesAdded.current.includes(remoteCandidate)) {
            addCandidate(JSON.parse(remoteCandidate));
            candidatesAdded.current.push(remoteCandidate);
          }
        });
      }
    }
  }, [
    getVConfQ.isSuccess,
    getVConfQ.data,
    updateVConfM,
    confId,
    announceMutation
  ]);

  // Is clerk loaded (i.e., do we know
  // what's up with the user yet)?
  let content: JSX.Element | null = null;
  if (isLoaded) {
    // Yes, is there a user signed in?
    if (isSignedIn) {
      // Yes, is this user included in this conf?
      if (isUserIncluded) {
        // Yes, render normal content
        content = (
          <>
            <Flex
              direction={'column'}
              alignItems={'center'}
              gap={'1rem'}
              color={'#fff'}
            >
              <video ref={selfView} autoPlay={true} muted={true}></video>
              <Player
                playerId={
                  isUserASide.current
                    ? getVConfQ.data?.playerAId || ''
                    : getVConfQ.data?.playerBId || ''
                }
              />
            </Flex>
            <Flex
              direction={'column'}
              alignItems={'center'}
              gap={'1rem'}
              color={'#fff'}
            >
              <video ref={remoteView} autoPlay={true}></video>
              <Player
                playerId={
                  isUserASide.current
                    ? getVConfQ.data?.playerBId || ''
                    : getVConfQ.data?.playerAId || ''
                }
              />
            </Flex>
          </>
        );
      } else {
        // Not part of this conf, redirect to
        // dashboard
        router.push({ pathname: 'dashboard' });
      }
    } else {
      // Not signed in, redirect to sign in
      return (
        <RedirectToSignIn
          afterSignInUrl={window.location.href}
          afterSignUpUrl={window.location.href}
        />
      );
    }
  }

  return (
    <Layout title='Video Conf'>
      <Flex
        sx={{
          video: {
            width: '50dvw',
            border: '2px solid rgba(0,0,0,0.2)'
          }
        }}
        alignItems={'center'}
        padding={'0.5rem'}
        gap={'0.5rem'}
      >
        {content}
      </Flex>
    </Layout>
  );
}
