import { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Menu, MenuItem, Container, Typography, IconButton, ListItemIcon, ListItemText } from '@mui/material';
// component
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';

import Iconify from '../../../components/Iconify';
import { RegisterForm } from './add';

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  // margin: 'auto',
  minHeight: '70vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 12),
  margin: theme.spacing(5, 0),
  backgroundColor: '#fff',
}));

export default function UserMoreMenu({ row }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const handleOpen = () => {
    setIsEdit(true);
    setOpen(true);
  };
  const handleClose = () => {
    setIsEdit(false);
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
            <Iconify icon="eva:trash-2-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem
          component={RouterLink}
          onClick={() => {
            handleOpen();
          }}
          to="#"
          sx={{ color: 'text.secondary' }}
        >
          <ListItemIcon>
            <Iconify
              icon="eva:edit-fill"
              onClick={() => {
                handleOpen();
              }}
              width={24}
              height={24}
            />
          </ListItemIcon>
          <ListItemText
            primary="Edit"
            onClick={() => {
              handleOpen();
            }}
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </MenuItem>
      </Menu>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Container maxWidth="sm">
          <ContentStyle>
            <Typography variant="h4" gutterBottom>
             {isEdit ? 'Edit User' : 'Add New User'}
            </Typography>

            <Typography sx={{ color: 'text.secondary', mb: 5 }}>Enter your details below.</Typography>

            <RegisterForm />
          </ContentStyle>
        </Container>
      </Modal>
    </>
  );
}
