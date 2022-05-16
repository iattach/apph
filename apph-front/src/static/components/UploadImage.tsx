import {
  Alert,
  Autocomplete,
  Avatar,
  Box,
  Button,
  Collapse,
  Container,
  createFilterOptions,
  CssBaseline,
  Dialog,
  FilterOptionsState,
  Input,
  LinearProgress,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import PhotoService from '../../services/PhotoService';
import { ITag, StatusType, UploadStatus } from '../../utils';
import { createRef, FormEvent, useEffect, useState } from 'react';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import TagService from '../../services/TagService';
import { DesktopDatePicker, LocalizationProvider } from '@mui/lab';
import { useDispatch, useSelector } from 'react-redux';
import { setTagList } from '../../redux/slices/tagSlice';
import { Upload } from '@mui/icons-material';

const filter = createFilterOptions<ITag>();

const UploadListItem = (props: { file: File; status: UploadStatus }) => {
  const uploadBody = () => {
    switch (props.status.type) {
      case StatusType.Success:
        return <Alert severity="success">{props.status.message}</Alert>;
      case StatusType.Error:
        return <Alert severity="error">{props.status.message}</Alert>;
      case StatusType.Uploading:
        return <LinearProgress />;
      default:
        return <></>;
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">
          {props.file.name}
        </Typography>
      </Box>
      <Box sx={{ width: '100%', mr: 1 }}>{uploadBody()}</Box>
    </Box>
  );
};

const UploadList = ({
  statuses,
  files
}: {
  statuses: UploadStatus[];
  files: FileList | undefined;
}) => {
  return (
    <>
      {files &&
        statuses.map(
          (status, i) =>
            !!files[i] && (
              <UploadListItem status={status} file={files[i]} key={i} />
            )
        )}
    </>
  );
};

export const UploadImage = (): JSX.Element => {
  const fileInput = createRef<HTMLInputElement>();
  const dispatch = useDispatch();
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [shootingDate, setShootingDate] = useState<Date>(new Date());
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const tagsInput = createRef<HTMLInputElement>();
  const [files, setFiles] = useState<FileList>();
  const [globalUploadStatus, setGlobalUploadStatus] = useState<UploadStatus>({
    type: StatusType.None
  });
  const [uploadStatuses, setUploadStatuses] = useState<UploadStatus[]>([]);
  const [selectedTags, setSelectedTags] = useState<ITag[]>([]);
  const tagList = useSelector(({ tagList }: { tagList: ITag[] }) => tagList);

  const createUploadCallbacks = (nbFiles: number) => {
    const handleSuccess = [];
    const handleError = [];
    for (let i = 0; i < nbFiles; i++) {
      handleSuccess.push(() => {
        setUploadStatuses((statuses) => [
          ...statuses.slice(0, i),
          {
            type: StatusType.Success,
            message: 'Votre fichier a bien été uploadé'
          },
          ...statuses.slice(i + 1)
        ]);
      });
      handleError.push((errorMessage: string) => {
        setUploadStatuses((statuses) => [
          ...statuses.slice(0, i),
          {
            type: StatusType.Error,
            message: errorMessage
          },
          ...statuses.slice(i + 1)
        ]);
      });
    }
    return { handleSuccess, handleError };
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setErrorMessage('');
    setTitle('');
    setDescription('');
    setShootingDate(new Date());
    setSelectedTags([]);
    setGlobalUploadStatus({ type: StatusType.None });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedTags.length < 1) {
      tagsInput.current?.setCustomValidity('Veuillez renseigner ce champ.');
      return;
    }
    const fileList = fileInput.current?.files;
    if (fileList) {
      setFiles(fileList);
      setGlobalUploadStatus({ type: StatusType.Uploading });
      setUploadStatuses(
        Array(fileList.length).fill({ type: StatusType.Uploading })
      );
      const { handleSuccess, handleError } = createUploadCallbacks(
        fileList.length
      );

      // We wait for the first upload to finish before sending the others because if new tags are created we need
      // their id in the following requests
      PhotoService.uploadImage(
        fileList.length > 1 ? `${title}_1` : title,
        description,
        shootingDate,
        fileList[0],
        selectedTags,
        '-1',
        handleSuccess[0],
        handleError[0]
      )?.then(() => {
        TagService.getAllTags(
          (tags: string) => {
            const tagsConverted: ITag[] = JSON.parse(tags);
            dispatch(setTagList(tagsConverted));
            // Get the id of tags that have been created
            const newSelectedTags = selectedTags.map(
              (selectedTag) =>
                tagsConverted.find(
                  (tag) => `+ Add New Tag ${tag.name}` == selectedTag.name
                ) ?? selectedTag
            );
            for (let i = 1; i < fileList.length; i++) {
              PhotoService.uploadImage(
                `${title}_${i + 1}`,
                description,
                shootingDate,
                fileList[i],
                newSelectedTags,
                '-1',
                handleSuccess[i],
                handleError[i]
              );
            }
          },
          (errorMessage: string) => setErrorMessage(errorMessage)
        );
      });
    }
  };

  const filterTags = (options: ITag[], params: FilterOptionsState<ITag>) => {
    const filtered = filter(
      options?.filter((tag) => tag.name !== null),
      params
    );
    const { inputValue } = params;
    const isExisting = options.some((option) => inputValue === option.name);
    if (inputValue !== '' && !isExisting) {
      filtered.push({
        name: `+ Add New Tag ${inputValue}`
      });
    }
    return filtered;
  };

  useEffect(() => {
    getTagList();
  }, []);

  const getTagList = () => {
    TagService.getAllTags(
      (tags: string) => {
        const tagsConverted: ITag[] = JSON.parse(tags);
        dispatch(setTagList(tagsConverted));
      },
      (errorMessage: string) => setErrorMessage(errorMessage)
    );
  };

  return (
    <Box sx={{ m: 1 }}>
      <Tooltip title="Upload">
        <Button
          variant="outlined"
          onClick={handleClickOpen}
          aria-label="upload-photo"
        >
          <Upload />
        </Button>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <Container component="main">
          <CssBaseline>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 3
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <PhotoCamera />
              </Avatar>
              <Typography component="h1" variant="h5">
                Ajouter une photo
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
                    label="Titre de la photo"
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
                    label="Description"
                    name="description"
                    autoComplete="description"
                    autoFocus
                  />
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DesktopDatePicker
                      label="Date de prise en vue"
                      value={shootingDate}
                      onChange={(date) => {
                        if (date) setShootingDate(date);
                        else setShootingDate(new Date());
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                  <Autocomplete
                    data-testid="#autocomplete"
                    multiple
                    limitTags={2}
                    id="tags"
                    size="small"
                    options={tagList}
                    onChange={(event, tags) => {
                      setSelectedTags(tags);
                      tagsInput.current?.setCustomValidity('');
                    }}
                    filterOptions={(options, params) =>
                      filterTags(options, params)
                    }
                    isOptionEqualToValue={(tag, value) =>
                      tag.name === value.name
                    }
                    getOptionLabel={(tag) => tag.name}
                    renderInput={(params) => (
                      <TextField
                        required={selectedTags.length === 0}
                        {...params}
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: 'new-password',
                          required: selectedTags.length === 0
                        }}
                        inputRef={tagsInput}
                        label="Tags"
                      />
                    )}
                  />
                  <Input
                    fullWidth
                    inputRef={fileInput}
                    inputProps={{
                      type: 'file',
                      accept: 'image/*',
                      'data-testid': 'file-input',
                      multiple: true
                    }}
                    required
                  />
                  <UploadList statuses={uploadStatuses} files={files} />
                  <Button type="submit" fullWidth variant="contained">
                    Ajouter
                  </Button>
                </Stack>
                <Collapse in={errorMessage != ''}>
                  <Alert severity="error">{errorMessage}</Alert>
                </Collapse>
              </Box>
            </Box>
          </CssBaseline>
        </Container>
      </Dialog>
    </Box>
  );
};
