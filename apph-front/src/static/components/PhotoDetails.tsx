import { Modal } from '@mui/material';
import Button from '@mui/material/Button';
import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { IPhotoDetails } from '../../utils/types/table';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 0.6,
  maxHeight: 0.7,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflow: 'scroll'
};

const detailBoxStyle = { mt: 3, display: 'flex' };

const titleTypoStyle = { fontWeight: 'bold', pl: 15 };

const detailTypoStyle = { ml: 1 };

const PhotoDetails = ({
  photoSrc,
  title,
  description,
  creationDate,
  shootingDate,
  size,
  tags
}: IPhotoDetails) => {
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);

  const handleOpenDetails = () => {
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
  };

  return (
    <>
      <Button variant="outlined" onClick={handleOpenDetails}>
        Détails
      </Button>
      <Modal
        open={detailsOpen}
        onClose={handleCloseDetails}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography
            id="modal-modal-title"
            component="h1"
            align="center"
            sx={{ fontSize: '2.5rem' }}
          >
            {title}
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{ mt: 2 }}
            align="center"
          >
            <Box component="img" sx={{ width: 0.7 }} src={photoSrc} />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}
            >
              <Box sx={detailBoxStyle}>
                <Typography sx={titleTypoStyle}>Titre:</Typography>
                <Typography sx={detailTypoStyle}>{title}</Typography>
              </Box>
              <Box sx={detailBoxStyle}>
                <Typography sx={titleTypoStyle}>Description:</Typography>
                <Typography sx={detailTypoStyle}>{description}</Typography>
              </Box>
              <Box sx={detailBoxStyle}>
                <Typography sx={titleTypoStyle}>Date de création:</Typography>
                <Typography sx={detailTypoStyle}>{creationDate}</Typography>
              </Box>
              <Box sx={detailBoxStyle}>
                <Typography sx={titleTypoStyle}>
                  Date de prise de vue:
                </Typography>
                <Typography sx={detailTypoStyle}>{shootingDate}</Typography>
              </Box>
              <Box sx={detailBoxStyle}>
                <Typography sx={titleTypoStyle}>Taille:</Typography>
                <Typography sx={detailTypoStyle}>
                  {size} bananes (à changer)
                </Typography>
              </Box>
              <Box sx={detailBoxStyle}>
                <Typography sx={titleTypoStyle}>Tags:</Typography>
                <Typography sx={detailTypoStyle}>
                  {tags.map((tag, index) => {
                    if (index !== tags.length - 1) {
                      return tag + ', ';
                    }
                    return tag;
                  })}
                </Typography>
              </Box>
            </Box>
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

export default PhotoDetails;
