import React, { useRef } from 'react';
import EmailEditor from 'react-email-editor';
import { Helmet } from 'react-helmet-async';


import { Container, Stack, Typography, Button } from '@mui/material';
import axios from 'axios';
import { useAuth } from "../context/AuthContext";
import Iconify from '../components/iconify';

export default function DashboardAppPage() {
  const emailEditorRef = useRef(null);
  const { user } = useAuth();

  const save = () => {
        const title = prompt('Enter a title for the newsletter:');
        const description = prompt('Enter a description for the newsletter:');
    
        if (!title || !description) {
          alert('Please enter a title and description for the newsletter.');
          return;
        }

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
            alert('Newsletter saved successfully!');
          })
          .catch((error) => {
            console.error('Failed to save newsletter:', error);
            alert('Failed to save newsletter. Please try again later.', error);
          });
      });
    });
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
          <Button onClick={save} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            Save Design
          </Button>
        </Stack>
        <Container style={{ transform: 'scale(0.925)', margin: '-5% 0 0 -10%' }}>
          <EmailEditor ref={emailEditorRef} onReady={onReady} />
        </Container>
      </Container>
    </>
  );
}
