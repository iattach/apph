import * as React from 'react';
import { SyntheticEvent, useEffect, useState } from 'react';
import { IFolder } from '../../utils/types/Folder';
import { FolderService } from '../../services/FolderService';
import CircularProgress from '@mui/material/CircularProgress';
import TreeView from '@mui/lab/TreeView';
import { FolderTree } from '../components/FolderTree';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { Alert, Box } from '@mui/material';
import { CreateFolderButton } from '../components/CreateFolderButton';

export const MyFoldersPage = (): JSX.Element => {
  const [rootFolder, setRootFolder] = useState<IFolder | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    getFolders().catch(console.error);
  }, []);

  const getFolders = async () => {
    await FolderService.getFolders(
      (parentFolder: IFolder) => {
        setRootFolder(parentFolder);
        setSelectedFolder(parentFolder.id.toString());
        setLoading(false);
      },
      (error: string) => {
        setErrorMessage(error);
        setLoading(false);
      }
    );
  };

  if (loading) {
    //TODO replace by a real loading page
    return <CircularProgress />;
  } else if (errorMessage) {
    return (
      <Alert sx={{ mb: 2 }} severity="error">
        {errorMessage}
      </Alert>
    );
  } else {
    return (
      <div
        style={{
          display: 'flex'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '30%'
          }}
        >
          <CreateFolderButton
            selected={selectedFolder}
            setRootFolder={setRootFolder}
          />
          <TreeView
            defaultCollapseIcon={<ExpandMore />}
            defaultExpandIcon={<ChevronRight />}
            selected={selectedFolder}
            onNodeSelect={(_event: SyntheticEvent, node: string) => {
              setSelectedFolder(node);
            }}
            sx={{
              overflowX: 'hidden',
              width: '100%'
            }}
          >
            <FolderTree folder={rootFolder} />
          </TreeView>
        </Box>
        {/*TODO display folder's content here*/}
        <div
          style={{
            width: '70%'
          }}
        >
          Selected folder's id: {selectedFolder}
        </div>
      </div>
    );
  }
};
