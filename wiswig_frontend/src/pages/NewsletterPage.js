import { useState, useEffect, useCallback, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { Grid, Button, Container, Stack, Typography } from '@mui/material';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { AuthContext } from '../context/AuthContext';
import Iconify from '../components/iconify';
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../sections/@dashboard/blog';
import NewsletterPopup from './Newsletter/NewsletterPopup';



const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'oldest', label: 'Oldest' },
];

export default function NewsletterPage() {
  const [newsletters, setNewsletters] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    axios
      .get('http://localhost:4000/newsletter/newsletters')
      .then((response) => {
        setNewsletters(response.data.newsletters);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const updateNewsletters = useCallback((newNewsletter) => {
    setNewsletters((newsletters) => [...newsletters, newNewsletter]);
  }, []);

  const handleNewNewsletterClick = () => {
    setIsPopupOpen(true);
  };

  const handleSaveNewsletter = (title, description) => {

    // create the request body with the title and description
    const requestBody = {
      title,
      description,

    };

    // make the POST request to the backend URL
    // const token = getCookie('jwt'); // retrieve the token from cookies
    fetch('http://localhost:4000/newsletter/add_newsletter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`, // add the token to the Authorization header
      },
      credentials: 'include', // include cookies in the request
      body: JSON.stringify(requestBody),


    })
      .then((response) => response.json())
      .then((data) => {
        // update the state with the new newsletter data
        console.log(requestBody);
        updateNewsletters(data);
        window.location.reload();
      })
      .catch((error) => console.error(error));

    setIsPopupOpen(false);

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

        <NewsletterPopup open={isPopupOpen} onClose={() => setIsPopupOpen(false)} onSave={handleSaveNewsletter} />      </Container>
    </>
  );
}
