import { useState, useEffect, useCallback, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { Grid, Button, Container, Stack, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
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
function UserFilterDropdown({ users, selectedUser, setSelectedUser }) {


  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
    console.log(event.target.value);

    // console.log(selectedUser);
  };


  if (!users) {
    return null; // or some other fallback component
  }

  return (
    <FormControl>
      <Select value={selectedUser || ''} onChange={handleUserChange}>
        <MenuItem value="">All</MenuItem>
        {users.map((user) => (
          <MenuItem key={user._id} value={user._id}>
            {user.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
export default function NewsletterPage() {
  const [newsletters, setNewsletters] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/admin/users')
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // add this line
        setUsers(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);


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
  const filteredNewsletters = newsletters.filter((newsletter) => {
    if (!selectedUser) {
      return true;
    }
    console.log(selectedUser);
    return newsletter.creator && newsletter.creator._id === selectedUser;
  });
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
          <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
            <BlogPostsSort options={SORT_OPTIONS} height="14px" width="12px" />
            <UserFilterDropdown height="14px" width="12px"
            users={users}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
          />
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {filteredNewsletters.map((newsletter) => (
          <BlogPostCard
            key={newsletter.id}
            newsletter={newsletter}
            onNewsletterDelete={(id) =>
              setNewsletters(newsletters.filter((n) => n.id !== id))
            }
          />
        ))}
      </Grid>

      <NewsletterPopup open={isPopupOpen} onClose={() => setIsPopupOpen(false)} onSave={handleSaveNewsletter} />      </Container >
    </>
  );
}
