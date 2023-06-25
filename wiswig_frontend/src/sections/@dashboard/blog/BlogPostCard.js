import PropTypes from 'prop-types';
import { alpha, styled } from '@mui/material/styles';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import React, { useContext, useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';

import { NewslettersContext } from '../../../components/popup/NewslettersContext';
import SendToPopup from '../../../components/popup/SendToPopup';

const StyledCardMedia = styled('div')({
  position: 'relative',
  paddingTop: 'calc(100% * 3 / 4)',
});

const StyledTitle = styled(Typography)({
  height: 44,
  overflow: 'hidden',
  WebkitLineClamp: 2,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
});

const StyledInfo = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  marginTop: theme.spacing(3),
  color: theme.palette.text.disabled,
}));

const StyledCover = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

BlogPostCard.propTypes = {
  newsletter: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    creator: PropTypes.object,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    HTMLcontent: PropTypes.string,
    status: PropTypes.string,
    createdAt: PropTypes.string,
    cover: PropTypes.string,
  }),
  index: PropTypes.number,
  slug: PropTypes.string,
};

export default function BlogPostCard({ newsletter, index, slug, onDelete, onDuplicate }) {
  const { description, createdAt } = newsletter;
  const coverUrl = `/assets/images/covers/${newsletter.cover}.jpg`;
  const { user } = useSelector((state) => state.user);
  const { enqueueSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [dialogDescription, setDialogDescription] = useState('');

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };



  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:4000/newsletter/delete/${newsletter._id}`, {
        withCredentials: true,
      });
      onDelete(newsletter._id); // Call onDelete prop with newsletter ID
      enqueueSnackbar('Newsletter deleted successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Error deleting newsletter', { variant: 'error' });
      console.error(`Error deleting newsletter with id ${newsletter._id}`, error);
    }
  };

  const handleDuplicate = async () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDuplicateNewsletter = async () => {
    try {
      const requestBody = {
        title,
        description: dialogDescription,
      };

      const response = await axios.post(`http://localhost:4000/newsletter/duplicate/${newsletter._id}`, requestBody, {
        withCredentials: true,
      });

      console.log(`Newsletter with id ${newsletter._id} has been duplicated`);
      const duplicatedNewsletter = response.data.savedNewsletter;
      onDuplicate(duplicatedNewsletter);
      setOpenDialog(false);
      enqueueSnackbar('Newsletter has been duplicated', { variant: 'success' });
    } catch (error) {
      console.error(`Error duplicating newsletter with id ${newsletter._id}`, error);
      enqueueSnackbar('Error duplicating newsletter', { variant: 'error' });
    }
  };

  const navigate = useNavigate();
  const handleEdit = async () => {
    try {
      navigate(`/dashboard/editor/${newsletter._id}`, { state: { templateJson: newsletter.JSONcontent } });
    } catch (error) {
      console.error(`Error navigating to editor for newsletter with id ${newsletter._id}`, error);
    }
  };

  const [showSendToPopup, setShowSendToPopup] = useState(false);

  const handleSendTo = () => {
    setShowSendToPopup(true);
  };

  return (
    <>
      <Grid item xs={12} sm={6} md={4}>
        <Card
          sx={{
            position: 'relative',
            backgroundColor: newsletter.JSONcontent ? 'inherit' : 'yellow',
          }}
        >
          <CardContent>
            <StyledCardMedia>
              <StyledCover src={coverUrl} alt={newsletter.title} />
            </StyledCardMedia>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <StyledTitle variant="h6" component="h3">
                {newsletter.title}
              </StyledTitle>
              <IconButton onClick={handleClick}>
                <MoreVertIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                {newsletter.creator && user && newsletter.creator._id === user._id ? (
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      handleEdit();
                    }}
                  >
                    Edit
                  </MenuItem>
                ) : (
                  <MenuItem disabled>Cannot Edit</MenuItem>
                )}
                <MenuItem
                  onClick={() => {
                    handleClose();
                    handleSendTo();
                  }}
                >
                  Send to...
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleDuplicate();
                    handleClose();
                  }}
                >
                  Duplicate
                </MenuItem>
                {newsletter.creator && user && newsletter.creator._id === user._id ? (
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      handleDelete();
                    }}
                  >
                    Delete
                  </MenuItem>
                ) : (
                  <MenuItem disabled>Cannot Delete</MenuItem>
                )}
              </Menu>
            </Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {description}
            </Typography>
            <StyledInfo>
              <Typography variant="body2" color="inherit">
                {new Date(createdAt).toLocaleDateString()}
              </Typography>
            </StyledInfo>
          </CardContent>
        </Card>
      </Grid>
      {showSendToPopup && (
        <SendToPopup
          handleSendTo={(selectedRows) => handleSendTo(selectedRows)}
          onClose={() => {
            setShowSendToPopup(false);
          }}
          newsletter={newsletter}
        />
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Duplicate Newsletter</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            value={dialogDescription}
            onChange={(e) => setDialogDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleDuplicateNewsletter}>Duplicate</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
