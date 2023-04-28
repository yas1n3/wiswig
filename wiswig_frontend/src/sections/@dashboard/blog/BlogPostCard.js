import PropTypes from 'prop-types';
import { alpha, styled } from '@mui/material/styles';
import { Box, Button, Card, CardContent, Grid, IconButton, Link, Menu, MenuItem, Typography } from '@mui/material';
import * as htmlToImage from 'html-to-image';
import { toPng } from 'html-to-image';
import React, { useContext, useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { NewslettersContext } from '../../../context/NewslettersContext';

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

export default function BlogPostCard({ newsletter, onNewsletterDelete, index, slug }) {
  const newslettersContext = useContext(NewslettersContext);
  const { description, HTMLcontent, createdAt } = newsletter;



  const [previewImage, setPreviewImage] = React.useState(null);
  const [newsletters, setNewsletters] = useState([]);
  const [templateJson, setTemplateJson] = useState({});

  const coverUrl = `/assets/images/covers/${newsletter.cover}.jpg`;






  React.useEffect(() => {
    if (HTMLcontent) {
      htmlToImage
        .toPng(HTMLcontent)
        .then((dataUrl) => {
          setPreviewImage(dataUrl);
        })
        .catch((error) => {
          console.error('Error generating preview image', error);
        });
    }
  }, [HTMLcontent]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { data } = useSWR(`http://localhost:4000/newsletter/newsletter/${newsletter._id}`, async (url) => {
    const response = await axios.get(url);
    return response.data;
  });
  const handleDelete = async () => {
    try {
      await axios.post(`http://localhost:4000/newsletter/delete/${newsletter._id}`);
      console.log(`Newsletter with id ${newsletter._id} has been deleted`);
      mutate(`http://localhost:4000/newsletter/${newsletter._id}`, undefined, true);
      // newslettersContext.deleteNewsletter(newsletter._id);
      setNewsletters((prevNewsletters) =>
        prevNewsletters.filter((prevNewsletter) => prevNewsletter._id !== newsletter._id)
      );
      window.location.reload();
    } catch (error) {
      console.error(`Error deleting newsletter with id ${newsletter._id}`, error);
    }
  };

  const handleDuplicate = async () => {
    try {
      await axios.post(`http://localhost:4000/newsletter/duplicate/${newsletter._id}`);
      console.log(`Newsletter with id ${newsletter._id} has been duplicated`);
      newslettersContext.addNewsletter(newsletter);
    } catch (error) {
      console.error(`Error duplicating newsletter with id ${newsletter._id}`, error);
    }
  };
  const navigate = useNavigate();
  const handleEdit = async () => {
    try {

      navigate(`/dashboard/editor/${newsletter._id}`, { state: { templateJson: newsletter.jsonContent } });
    } catch (error) {
      console.error(`Error navigating to editor for newsletter with id ${newsletter._id}`, error);
    }
  };


  const handleSendTo = () => {
    console.log(`Sending newsletter with slug: ${slug} to...`);
  };

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card sx={{ position: 'relative' }}>
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
              <MenuItem
                onClick={() => {
                  handleClose();
                  handleEdit();
                }}
              >
                Edit
              </MenuItem>
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
                  handleClose();
                  handleDuplicate();
                }}
              >
                Duplicate
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  handleDelete();
                }}
              >
                Delete
              </MenuItem>
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
  );
}
