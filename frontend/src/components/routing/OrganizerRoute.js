import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const OrganizerRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  return user && (user.role === 'organizer' || user.role === 'admin') ? (
    children
  ) : (
    <Navigate to="/" />
  );
};

export default OrganizerRoute; 