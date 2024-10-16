'use client';

import { List, ListItem, ListItemText, Typography, CircularProgress } from '@mui/material';
import { useUsers } from '../hooks/useUsers';

export default function UsersPage() {
  const { users, loading, error } = useUsers();

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <div>
      <Typography variant="h4" gutterBottom>Users</Typography>
      <List>
        {users.map((user) => (
          <ListItem key={user.id}>
            <ListItemText
              primary={user.name}
              secondary={`Email: ${user.email}, Joined `}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
}
