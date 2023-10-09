import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import EmailEditor from 'react-email-editor';
import { Helmet } from 'react-helmet-async';
import { Container, Stack, Typography, Button } from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

import Iconify from '../components/iconify';





export default function DashboardAppPage() {
  const { enqueueSnackbar } = useSnackbar();

  const emailEditorRef = useRef(null);
  const { id } = useParams();
  const [templateJson, setTemplateJson] = useState(null);
  const [newsletterTitle, setNewsletterTitle] = useState('');
  const [newsletterCreator, setNewsletterCreator] = useState('');
  const { user } = useSelector((state) => state.user);
  // const isDisabled = newsletterCreator === user._id;
  const isDisabled = false;




  useEffect(() => {
    fetch(`http://localhost:4000/newsletter/newsletter/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const parsedJson = JSON.parse(data.newsletter.JSONcontent); // Parsing the JSON content is an important step which I forgot in early commits
        setTemplateJson(parsedJson);
        setNewsletterTitle(data.newsletter.title);
        setNewsletterCreator(data.newsletter.creator._id)
      })
      .catch((error) => console.error(error));
  }, [id]);

  const save = () => {
    emailEditorRef.current?.saveDesign((design) => {
      emailEditorRef.current?.exportHtml((data) => {
        const { html } = data;

        const newsletter = {
          HTMLcontent: html,
          JSONcontent: JSON.stringify(design),
        };

        axios
          .put(`http://localhost:4000/newsletter/editnewsletter/${id}`, newsletter, {
            withCredentials: true,
          })
          .then((response) => {
            console.log('Newsletter saved:', response.data);
            // alert('Newsletter saved successfully!');
            enqueueSnackbar('Newsletter saved successfully!', { variant: 'success', autoHideDuration: 3000 });

          })
          .catch((error) => {
            console.error('Failed to save newsletter:', error);
            // alert('Failed to save newsletter. Please try again later.', error);
            enqueueSnackbar('Failed to save newsletter. Please try again later.', { variant: 'error', autoHideDuration: 3000 });

          });
      });
    });
  };
  const onDesignLoad = (data) => {
    console.log('onDesignLoad', data);
  };

  const onReady = () => {
    console.log('onReady');

    emailEditorRef.current.editor.addEventListener(
      'design:loaded',
      onDesignLoad
    );

    emailEditorRef.current.editor.loadDesign(templateJson);
    console.log('templateJson', templateJson);
  };


  return (
    <>
      <Helmet>
        <title>Newsletter builder | Wiswig</title>
      </Helmet>
      <Container>
        <style>{`.blockbuilder-branding, .brand { display: none !important; }`}</style>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Newsletter builder
          </Typography>
          <Button
            onClick={save}
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            disabled={isDisabled}
          >
            Save Design
          </Button>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h6" gutterBottom>
            {newsletterTitle}
          </Typography>
        </Stack>

        <Container style={{ transform: 'scale(0.925)', margin: '-5% 0 0 -10%' }}>
          <EmailEditor ref={emailEditorRef} onReady={onReady} />
        </Container>
      </Container>
    </>
  );
}
