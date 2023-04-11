import React, { useRef, useState } from 'react';
import { Container, Stack, Typography, Button, TextField } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import EmailEditor from 'react-email-editor';
import { useAuth } from '../context/AuthContext';
import Iconify from '../components/iconify';
import SuccessPopup from './Newsletter/SuccessPopup';
import NewsletterPopup from './Newsletter/NewsletterPopup';

export default function DashboardAppPage() {
  const emailEditorRef = useRef(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { user } = useAuth();

  const handleSave = () => {
    emailEditorRef.current?.saveDesign((design) => {
      emailEditorRef.current?.exportHtml((data) => {
        const { html } = data;

        const newsletter = {
          title,
          description,
          HTMLcontent: html,
          JSONcontent: JSON.stringify(design),
        };

        if (user) {
          newsletter.creator = user._id;
        }

        axios
          .post('http://localhost:4000/newsletter/add_newsletter', newsletter)
          .then((response) => {
            console.log('Newsletter saved:', response.data);
            setIsSuccess(true);
            setIsPopupOpen(false);
          })
          .catch((error) => {
            console.error('Failed to save newsletter:', error);
            alert('Failed to save newsletter. Please try again later.', error);
          });
      });
    });
  };


  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const onReady = () => {
    // editor is ready
    // you can load your template here;
    // const templateJson = {};
    // emailEditorRef.current.editor.loadDesign(templateJson);
  };

  return (
    <>
      <Helmet>
        <title>Newsletter builder | Wiswig</title>
      </Helmet>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Newsletter builder
          </Typography>
          <Button onClick={openPopup} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            Save Design
          </Button>
        </Stack>
        <Container style={{ transform: 'scale(0.925)', margin: '-5% 0 0 -10%' }}>
          <EmailEditor ref={emailEditorRef} onReady={onReady} />
        </Container>
        {/* <TextField
          autoFocus
          margin="dense"
          id="title"
          label="Title"
          type="text"
          fullWidth
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <TextField
          margin="dense"
          id="description"
          label="Description"
          type="text"
          fullWidth
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        /> */}
      </Container>
      <NewsletterPopup
        open={isPopupOpen}
        onClose={closePopup}
        onSave={(title, description) => {
          setTitle(title);
          setDescription(description);
          handleSave();
        }}
        title={title}
        description={description}
      />



    </>
  );
}