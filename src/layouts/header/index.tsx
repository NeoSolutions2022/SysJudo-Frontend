import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { AppBar, Toolbar, Typography, Divider } from '@mui/material';
import { LogoutOutlined } from '@mui/icons-material';
import * as S from '../components/index'
import { useAuthContext } from '../../hooks/useAuthProvider';
import { useNavigate } from 'react-router';

// import HeaderItemComponent from '../components';

const NAV_WIDTH = 280;

const HEADER_MOBILE = 64;

const HEADER_DESKTOP = 92;

const StyledRoot = styled(AppBar)(({ theme }) => ({
  maxHeight: '6.5vh',
  boxShadow: '0px 2px 5px 1px rgba(0,0,0,0.54)',
  backgroundColor: "#EAEAEA",
  color: "#1d93ff",
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  // [theme.breakpoints.up('lg')]: {
  //   width: `calc(100% - ${NAV_WIDTH + 1}px)`,
  // },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
  display: 'flex',
  // [theme.breakpoints.up('lg')]: {
  //   minHeight: HEADER_DESKTOP,
  //   padding: theme.spacing(0, 5),
  // },
}));

// ----------------------------------------------------------------------

Header.propTypes = {
  onOpenNav: PropTypes.func,
};



const HeaderOptions = [
  {
    title: 'Cadastro'
  },
  {
    title: 'Serviços',
  },
  {
    title: 'Competições',
  },
  {
    title: 'Segurança',
  },
];

interface HeaderItemProps {
  title: string;
}

const HeaderItem = ({ title } : HeaderItemProps)  => {
  return (
    <>    
      <Divider orientation="vertical" flexItem color="#ccc" sx={{  maxHeight: '6.5vh',}} />
      <Typography
        variant="h6"
        sx={{
          width: 140,
          display: 'flex',
          justifyContent: 'center',
          color: 'inherit',
          fontWeight: 'medium',
          cursor: 'pointer',
        }}
      >
        {title}
      </Typography>
      <Divider orientation="vertical" flexItem color="#ccc" />
    </>
  );
}

//{ onOpenNav }
export function Header() {
  const { logout } = useAuthContext();
  const navigate = useNavigate()
  return (
    <StyledRoot>
      <StyledToolbar>

    <S.HeaderItemComponent title='Cadastro'>
    </S.HeaderItemComponent>
    <S.HeaderItemComponent title='Serviço'>
    </S.HeaderItemComponent>   
    <S.HeaderItemComponent title='Competição'>
    </S.HeaderItemComponent>    

    <S.HeaderItemComponent title='Segurança'>
      <button onClick={() => navigate('/listagem-eventos')}>Eventos</button>
    </S.HeaderItemComponent>

      {/* { HeaderOptions.map((option, index) => (
          <HeaderItem title={option.title} key={index} />
        ))}  */}

      </StyledToolbar>
      <LogoutOutlined
        onClick={logout}
        sx={{
          cursor: 'pointer',
          mr:2,
        }}
      />
    </StyledRoot>
  );
}