import { Box, CircularProgress } from '@mui/material';

interface LoadingProps{
  width?: number
}

export function Loading({width} : LoadingProps){
  return (
    <Box sx={{width:  '100%', height:'100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <CircularProgress size={width ? width : 250} thickness={.5}/>

    </Box>
  
  )
}