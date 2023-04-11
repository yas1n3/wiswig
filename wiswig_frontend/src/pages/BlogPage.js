import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Grid, Button, Container, Stack, Typography } from '@mui/material';
import axios from 'axios';
import Iconify from '../components/iconify';
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../sections/@dashboard/blog';

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'oldest', label: 'Oldest' },
];

export default function BlogPage() {
  const [newsletters, setNewsletters] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/newsletter/newsletters')
      .then(response => {
        setNewsletters(response.data.newsletters);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const handleNewNewsletterClick = () => {
    // code to handle "New NS" button click
  };

  return (
    <>
      <Helmet>
        <title> NS | Wiswig </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            NS
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleNewNewsletterClick}>
            New
          </Button>
        </Stack>

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <BlogPostsSearch posts={newsletters} setPosts={setNewsletters} />
          <BlogPostsSort options={SORT_OPTIONS} />
        </Stack>

        <Grid container spacing={3}>
          {newsletters.map((newsletter) => (
            <BlogPostCard
              key={newsletter.id}
              newsletter={newsletter}
              onNewsletterDelete={(id) => setNewsletters(newsletters.filter((n) => n.id !== id))}
            />
          ))}
        </Grid>

      </Container>
    </>
  );
}
