/* eslint-disable */
import { useRef, useState } from 'react';

// material
import { Menu, MenuItem, Container, Typography, IconButton, ListItemIcon, ListItemText } from '@mui/material';
// component

import { styled } from '@mui/material/styles';

import Iconify from '../../../components/Iconify';

import axios from 'axios';

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  // margin: 'auto',
  minHeight: '70vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(4, 12),
  margin: theme.spacing(3, 0),
  backgroundColor: '#fff',
}));

export default function UserMoreMenu({ row }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(false);

  const handleDelete = () => {
    var config = {
      method: 'delete',
      url: `http://localhost:5000/domain/delete/${row.id}`,
      headers: {},
    };
    axios(config)
      .then(function (response) {
        window.location.reload();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleOpen = () => {
    setIsEdit(true);
    setOpen(true);
  };

  const handleOpenView = () => {
    setIsView(true);
    setOpen(true);
  };
  const handleClose = () => {
    setIsEdit(false);
    setIsView(false);
    setOpen(false);
  };

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Iconify
              icon="eva:download-fill"
              onClick={() => {
                const link = `http://localhost:5000/${row.ads_code}`;
                window.open(link);
              }}
              width={24}
              height={24}
            />
          </ListItemIcon>
          <ListItemText
            primary="Download"
            onClick={() => {
              const link = `http://localhost:5000/${row.ads_code}`;
              window.open(link);
            }}
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </MenuItem>
      </Menu>
    </>
  );
}
