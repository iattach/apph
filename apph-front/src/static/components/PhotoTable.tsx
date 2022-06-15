import * as React from 'react';
import { Dispatch, useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridSelectionModel } from '@mui/x-data-grid';
import { Stack } from '@mui/material';
import { ITable, ITag } from '../../utils';
import { DownloadImage } from './DownloadImage';
import { useDispatch } from 'react-redux';
import { replaceSelectedPhotos } from '../../redux/slices/photoSlice';
import { useTranslation } from 'react-i18next';

interface photoTableProps {
  data: ITable[];
  loading: boolean;
  totalSize: number;
  page: number;
  setPage: Dispatch<React.SetStateAction<number>>;
  pageSize: number;
  setPageSize: Dispatch<React.SetStateAction<number>>;
  selected?: number[];
}

export const PhotoTable = ({
  data,
  loading = false,
  totalSize = 0,
  page = 0,
  setPage,
  pageSize = 5,
  setPageSize,
  selected
}: photoTableProps) => {
  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const columns: GridColDef[] = [
    {
      field: 'title',
      headerName: t('photoTable.title'),
      flex: 1,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'description',
      headerName: t('photoTable.description'),
      flex: 1.7,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'creationDate',
      headerName: t('photoTable.creationDate'),
      type: 'date',
      flex: 2.2,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => params.row.creationDate?.toLocaleString()
    },
    {
      field: 'shootingDate',
      headerName: t('photoTable.shootingDate'),
      type: 'date',
      flex: 2.2,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => params.row.shootingDate?.toLocaleString()
    },
    {
      field: 'size',
      headerName: t('photoTable.size') + '(Ko)',
      type: 'number',
      flex: 1,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'tags',
      headerName: t('photoTable.tags'),
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
      headerName: t('photoTable.url'),
      flex: 1,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'actions',
      headerName: t('photoTable.actions'),
      flex: 2,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Stack spacing={2} direction="row">
          {params.row.details} <DownloadImage id={+params.id} />
        </Stack>
      )
    }
  ];

  useEffect(() => {
    if (selected) setSelectionModel(selected);
  }, [data]);

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
        columnBuffer={9}
        onSelectionModelChange={(ids: GridSelectionModel) => {
          setSelectionModel(ids);
          const selectedIDs = new Set(ids);
          const selectedRowData = data.filter((rows) =>
            selectedIDs.has(rows.id)
          );
          if (selectedRowData.length) {
            dispatch(replaceSelectedPhotos(JSON.stringify(selectedRowData)));
          }
        }}
        selectionModel={selectionModel}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
  );
};
