/* eslint-disable */
import { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Menu, MenuItem, Container, Typography, IconButton, ListItemIcon, ListItemText } from '@mui/material';
// component
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';

import Iconify from '../../../components/Iconify';
import { RegisterForm } from './add';
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

  const handleDelete = () => {
    var config = {
      method: 'delete',
      url: `http://localhost:5000/reports/delete/${row.id}`,
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
              onClick={() => {
                handleDelete();
              }}
              icon="eva:trash-2-outline"
              width={24}
              height={24}
            />
          </ListItemIcon>
          <ListItemText
            onClick={() => {
              handleDelete();
            }}
            primary="Delete"
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </MenuItem>

        <MenuItem sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Iconify
              icon="eva:download-fill"
              onClick={() => {
                const link = `http://localhost:5000/${row.file}`;
                window.open(link);
              }}
              width={24}
              height={24}
            />
          </ListItemIcon>
          <ListItemText
            primary="Download"
            onClick={() => {
              const link = `http://localhost:5000/${row.file}`;
              window.open(link);
            }}
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </MenuItem>
      </Menu>
    </>
  );
}
