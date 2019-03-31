import React from 'react';
import { Anchor, Box, Menu } from 'grommet';

export default function AppHeader(props) {
  return (
    <header justify="center" colorIndex="neutral-4">
      <Box
        size={{ width: { max: 'xxlarge' } }}
        direction="row"
        responsive={false}
        justify="start"
        align="center"
        pad={{ horizontal: 'medium' }}
        flex="grow"
      >
        <Box pad="small" />
        <Menu label="Menu" inline={true} direction="row" flex="grow" />

        <Box flex="grow" align="end" />
      </Box>
    </header>
  );
}
