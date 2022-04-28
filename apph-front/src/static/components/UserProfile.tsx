import * as React from 'react';
import { IUser, makeCardStyles } from '../../utils';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export const UserProfile = ({
  firstname,
  lastname,
  login
}: IUser): JSX.Element => {
  const classes = makeCardStyles();
  return (
    <Card className={classes.cardStyle}>
      <CardHeader title={`${firstname} ${lastname}`} />
      <CardContent>
        <Typography variant="body2">Email: {login}</Typography>
        <Link to="/me/edit">Modifier</Link>
      </CardContent>
    </Card>
  );
};
