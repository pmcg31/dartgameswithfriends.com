import { Flex, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { BsPersonCircle } from 'react-icons/bs';

export default function AuthManager({
  backgroundColor
}: {
  backgroundColor: string;
}): JSX.Element {
  const { data: session } = useSession();
  if (session) {
    let icon = <BsPersonCircle />;
    if (session.user.image) {
      icon = (
        <img
          src={session.user.image}
          style={{ borderRadius: '50%', height: '1.5rem' }}
        />
      );
    }
    console.log(session);
    return (
      <Menu>
        <MenuButton>
          <Flex alignItems={'center'} gap={'0.5rem'}>
            {icon} {session.user.name || session.user.email}
          </Flex>
        </MenuButton>
        <MenuList backgroundColor={backgroundColor}>
          <MenuItem onClick={() => signOut()} backgroundColor={backgroundColor}>
            Sign Out
          </MenuItem>
        </MenuList>
      </Menu>
    );
  }
  return <button onClick={() => signIn()}>Sign In</button>;
}
