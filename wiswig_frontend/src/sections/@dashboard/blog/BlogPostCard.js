import PropTypes from 'prop-types';
import { alpha, styled } from '@mui/material/styles';
import { Box, Button, Card, CardContent, Grid, Link, Typography } from '@mui/material';
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import React from 'react';



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
    creator: PropTypes.object,
    title: PropTypes.string,
    description: PropTypes.string,
    HTMLcontent: PropTypes.string,
    status: PropTypes.string,
    createdAt: PropTypes.string,
  }),
  index: PropTypes.number,
  slug: PropTypes.string,
};

export default function BlogPostCard({ newsletter, index, slug }) {
  const { title, description, HTMLcontent, createdAt } = newsletter;
  const latestPostLarge = index === 0;
  const latestPost = index === 1 || index === 2;

  const [previewImage, setPreviewImage] = React.useState(null);

  React.useEffect(() => {
    if (HTMLcontent) {
      htmlToImage.toPng(HTMLcontent)
        .then((dataUrl) => {
          setPreviewImage(dataUrl);
        })
        .catch((error) => {
          console.error('Error generating preview image', error);
        });
    }
  }, [HTMLcontent]);

  return (
    <Grid item xs={12} sm={latestPostLarge ? 12 : 6} md={latestPostLarge ? 6 : 3}>
      <Card sx={{ position: 'relative' }}>
        <StyledCardMedia
          sx={{
            ...((latestPostLarge || latestPost) && {
              pt: 'calc(100% * 4 / 3)',
              '&:after': {
                top: 0,
                content: "''",
                width: '100%',
                height: '100%',
                position: 'absolute',
                bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
              },
            }),
            ...(latestPostLarge && {
              pt: {
                xs: 'calc(100% * 4 / 3)',
                sm: 'calc(100% * 3 / 4.66)',
              },
            }),
          }}
        >
          {previewImage ? (
            <StyledCover alt={title} src={previewImage} />
          ) : (
            <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Loading preview...
              </Typography>
            </Box>
          )}
        </StyledCardMedia>

        <CardContent sx={{ pb: 0 }}>
          <Box sx={{ mb: 2 }}>
            <StyledTitle variant="h5" component="h2" gutterBottom>
              {title}
            </StyledTitle>
            <StyledInfo>
              <Typography variant="body2">
                {new Date(createdAt).toLocaleDateString()}
              </Typography>
            </StyledInfo>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
          }}
        >
          <Link href={`/newsletter/${slug}`} passHref>
            <Button variant="contained" color="primary">
              Read More
            </Button>
          </Link>
        </Box>
      </Card>
    </Grid>
  );
}






