import { Route, Routes } from 'react-router-dom';
import { UserProfileContainer } from './static/containers/UserProfileContainer';
import { SignIn } from './static/components/SignIn';
import { TODOContainer } from './static/containers/TODOContainer';
import { MyFoldersContainer } from './static/containers/MyFoldersContainer';
import { EditProfile } from './static/components/EditProfile';

export const PrivateRoutes = (): JSX.Element => {
  return (
    <Routes>
      <Route path="/login" element={<SignIn />} />
      <Route path="/me" element={<UserProfileContainer />} />
      <Route path="/me/edit" element={<EditProfile />} />
      <Route
        path="/pictures"
        element={<TODOContainer todo="Page: Mes Photos" />}
      />
      <Route path="/folders" element={<MyFoldersContainer />} />
      <Route
        path="/trips"
        element={<TODOContainer todo="Page: Mes Voyages" />}
      />
      <Route path="/tags" element={<TODOContainer todo="Page: Mes Tags" />} />
      <Route
        path="/treatments"
        element={<TODOContainer todo="Page: Mes Traitements" />}
      />
      <Route
        path="/research"
        element={<TODOContainer todo="Page: Rechercher Avancée" />}
      />
    </Routes>
  );
};
