import * as React from 'react';
import { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Alert, Collapse, IconButton, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { IPagination, ITable, ITag } from '../../utils';
import PhotoService from '../../services/PhotoService';
import PhotoDetails from './PhotoDetails';
import { DownloadImage } from './DownloadImage';

const columns: GridColDef[] = [
  {
    field: 'title',
    headerName: 'Titre',
    flex: 1,
    align: 'center',
    headerAlign: 'center'
  },
  {
    field: 'description',
    headerName: 'Description',
    flex: 1.7,
    align: 'center',
    headerAlign: 'center'
  },
  {
    field: 'creationDate',
    headerName: 'Date de création',
    type: 'date',
    flex: 2.2,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => params.row.creationDate?.toLocaleString()
  },
  {
    field: 'shootingDate',
    headerName: 'Date de prise de vue',
    type: 'date',
    flex: 2.2,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => params.row.shootingDate?.toLocaleString()
  },
  {
    field: 'size',
    headerName: 'Taille(Ko)',
    type: 'number',
    flex: 1,
    align: 'center',
    headerAlign: 'center'
  },
  {
    field: 'tags',
    headerName: 'Tags',
    flex: 1.5,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) =>
      params.row.tags.map((tag: ITag, index: number) => {
        if (index !== params.row.tags.length - 1) {
          return tag.name + ', ';
        }
        return tag.name;
      })
  },
  {
    field: 'url',
    headerName: 'Url',
    flex: 1,
    align: 'center',
    headerAlign: 'center'
  },
  {
    field: 'actions',
    headerName: 'Actions',
    flex: 3,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => (
      <Stack spacing={2} direction="row">
        {params.row.details} <DownloadImage id={+params.id} />
      </Stack>
    )
  }
];
export const PhotoTable = () => {
  const [data, setData] = useState<ITable[]>(new Array<ITable>());
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [pageSize, setPageSize] = useState<number>(5);
  const [page, setPage] = useState<number>(0);
  const [totalSize, setTotalSize] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const getData = () => {
    setLoading(true);
    PhotoService.getData(
      pageSize,
      page + 1,
      (pagination: IPagination) => {
        pagination.photoList.forEach(
          (row) =>
            (row.details = (
              <PhotoDetails
                photoId={row.id}
                photoSrc={row.url}
                title={row.title}
                description={row.description}
                creationDate={row.creationDate}
                shootingDate={row.shootingDate}
                size={row.size}
                tags={row.tags}
              />
            ))
        );
        setData(pagination.photoList);
        setTotalSize(pagination.totalSize);
        setLoading(false);
      },
      (error: string) => {
        setErrorMessage(error);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    getData();
    const timer = setInterval(getData, 3000);
    return () => clearInterval(timer);
  }, [page, pageSize]);

  return (
    <div style={{ height: 115 + pageSize * 52, width: '100%' }}>
      <DataGrid
        pagination
        paginationMode="server"
        page={page}
        loading={loading}
        rows={data}
        rowCount={totalSize}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 20]}
        onPageChange={(pageIndex) => setPage(pageIndex)}
        onPageSizeChange={(size) => {
          const newPage = Math.trunc(pageSize / size) * page;
          setPageSize(size);
          setPage(newPage);
        }}
        columnBuffer={8}
      />
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
          {errorMessage}
        </Alert>
      </Collapse>
    </div>
  );
};
