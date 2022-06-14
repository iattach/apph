import { ITag } from '../../utils';
import {
  Alert,
  Box,
  Button,
  Collapse,
  Container,
  CssBaseline,
  Dialog,
  IconButton,
  Stack,
  TextField
} from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/lab';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import * as React from 'react';
import { FormEvent, useEffect, useState } from 'react';
import PhotoService from '../../services/PhotoService';
import { TagInput } from './TagInput';
import TagService from '../../services/TagService';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';

export const EditPhotoDetails = (props: {
  id: number;
  title: string;
  description: string;
  shootingDate: Date;
  tags: ITag[];
  onEdit: () => void;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState(props.title);
  const [description, setDescription] = useState(props.description);
  const [shootingDate, setShootingDate] = useState(props.shootingDate);
  const [allTags, setAllTags] = useState<ITag[]>([]);
  const [selectedTags, setSelectedTags] = useState<ITag[]>(props.tags);
  const [tagsValidity, setTagsValidity] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { t } = useTranslation();

  useEffect(() => {
    TagService.getAllTags(
      (tags: string) => {
        const tagsConverted: ITag[] = JSON.parse(tags);
        setAllTags(tagsConverted);
      },
      (errorMessage: string) => {
        setErrorMessage(errorMessage);
      }
    );
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedTags.length < 1) {
      setTagsValidity(false);
      return;
    }
    PhotoService.editInfos(
      props.id,
      title,
      description,
      selectedTags,
      shootingDate,
      () => setOpen(false),
      (error) => setErrorMessage(error)
    ).then(props.onEdit);
  };

  const handleClose = () => {
    setTitle(props.title);
    setDescription(props.description);
    setShootingDate(props.shootingDate);
    setSelectedTags(props.tags);
    setOpen(false);
  };

  return (
    <Box>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        {t('action.modify')}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <Container component="main">
          <CssBaseline>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                m: 3
              }}
            >
              <Box component="form" onSubmit={handleSubmit}>
                <Stack
                  direction="column"
                  spacing={2}
                  sx={{
                    width: {
                      xs: 200,
                      sm: 300,
                      lg: 400,
                      xl: 500
                    }
                  }}
                >
                  <TextField
                    required
                    fullWidth
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    id="title"
                    label={t('photo.title')}
                    name="title"
                    autoComplete="title"
                    autoFocus
                  />
                  <TextField
                    required
                    fullWidth
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    id="description"
                    label={t('photoTable.description')}
                    name="description"
                    autoComplete="description"
                    autoFocus
                  />
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DesktopDatePicker
                      label={t('photoTable.shootingDate')}
                      value={shootingDate}
                      onChange={(date) => {
                        if (date) setShootingDate(date);
                        else setShootingDate(props.shootingDate);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                  <TagInput
                    allTags={allTags}
                    onChange={(tags) => setSelectedTags(tags)}
                    isValid={tagsValidity}
                    defaultValue={props.tags}
                  />
                  <Button type="submit" fullWidth variant="contained">
                    {t('action.confirm')}
                  </Button>
                  <Collapse in={errorMessage !== ''}>
                    <Alert
                      action={
                        <IconButton
                          aria-label="close"
                          color="inherit"
                          size="small"
                          onClick={() => {
                            setErrorMessage('');
                          }}
                        >
                          <CloseIcon fontSize="inherit" />
                        </IconButton>
                      }
                      sx={{ mb: 2 }}
                      severity="error"
                    >
                      {t(errorMessage)}
                    </Alert>
                  </Collapse>
                </Stack>
              </Box>
            </Box>
          </CssBaseline>
        </Container>
      </Dialog>
    </Box>
  );
};
