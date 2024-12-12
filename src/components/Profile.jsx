
import { Container } from "react-bootstrap";
import { useAuth } from "../context/Authcontext";

function Profile() {
  const user = useAuth();

  return (
    <Container>
      <h1>Profile</h1>
      <p>Welcome, {user}!</p>
    </Container>
  );
}

export default Profile;
