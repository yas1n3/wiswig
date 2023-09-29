import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Grid, Button, Container, Stack, Typography, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import axios from 'axios';
import Iconify from '../components/iconify';
import { BlogPostCard } from '../sections/@dashboard/blog';
import NewsletterPopup from './Newsletter/NewsletterPopup';

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
];

function UserFilterDropdown({ users, selectedUser, setSelectedUser }) {
  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
    console.log(event.target.value);
  };

  if (!users || users.length === 0) {
    return null;
  }

  return (
    <FormControl>
      <Select
        value={selectedUser || ''}
        onChange={handleUserChange}
        displayEmpty
        renderValue={(value) => {
          if (value === '') {
            return 'All users';
          }
          const selectedUserObj = users.find((user) => user._id === value);
          return selectedUserObj ? `${selectedUserObj.name}` : '';
        }}
      >
        <MenuItem value="">All users</MenuItem>
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
  const [selectedUser, setSelectedUser] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedSortOption, setSelectedSortOption] = useState('latest');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/admin/users')
      .then((response) => response.json())
      .then((data) => {
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

  const handleNewNewsletterClick = () => {
    setIsPopupOpen(true);
  };

  const handleSaveNewsletter = (title, description) => {
    const requestBody = {
      title,
      description,
    };

    axios
      .post('http://localhost:4000/newsletter/add_newsletter', requestBody, {
        withCredentials: true, // Include cookies in the request
      })
      .then((response) => {
        console.log(response.data.newsletter);
        const newNewsletter = response.data.newsletter;
        setNewsletters((prevNewsletters) => [...prevNewsletters, newNewsletter]);
        setIsPopupOpen(false);
      })
      .catch((error) => console.error(error));
  };

  const handleDelete = async (id) => {
    try {
      setNewsletters((prevNewsletters) => prevNewsletters.filter((n) => n._id !== id));
    } catch (error) {
      console.error(`Error deleting newsletter with id ${id}`, error);
    }
  };

  const handleDuplicate = (ns) => {
    if (ns) {
      setNewsletters((prevNewsletters) => [...prevNewsletters, ns]);
    }
  };

  const handleSortChange = (event) => {
    setSelectedSortOption(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredNewsletters = newsletters
    .filter((newsletter) => {
      if (!selectedUser) {
        return true;
      }
      return newsletter.creator && newsletter.creator._id === selectedUser;
    })
    .filter((newsletter) => {
      if (searchTerm.trim() === '') {
        return true;
      }
      const title = newsletter.title.toLowerCase();
      const description = newsletter.description.toLowerCase();
      const search = searchTerm.toLowerCase();
      return title.includes(search) || description.includes(search);
    })
    .sort((a, b) => {
      if (selectedSortOption === 'latest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } if (selectedSortOption === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      return 0;
    });

  return (
    <>
      <Helmet>
        <title> Newsletters | Wiswig </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Newsletters
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleNewNewsletterClick}>
            New
          </Button>
        </Stack>

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <TextField label="Search" value={searchTerm} onChange={handleSearchChange} />
          <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <FormControl>
              <Select value={selectedSortOption} onChange={handleSortChange}>
                {SORT_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <UserFilterDropdown
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
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
            />
          ))}
        </Grid>

        <NewsletterPopup open={isPopupOpen} onClose={() => setIsPopupOpen(false)} onSave={handleSaveNewsletter} />
      </Container>
    </>
  );
}
