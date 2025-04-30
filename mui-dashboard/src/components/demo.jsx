// demo.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import NestedMenu from './NestedMenu';

const Demo = ({ data, onShowVideos }) => (
  <Box p={2} height={460}>
    {data.weeks ? (
      <NestedMenu data={data} onShowVideos={onShowVideos} />
    ) : (
      <Typography>Loading...</Typography>
    )}
  </Box>
);

export default Demo;