import LogoutButton from './LogoutButton';

export default function Dashboard({ user, onLogout }) {
  return (
    <div style={styles.container}>
      <h2>Welcome, {user.role}</h2>

      <div style={styles.section}>
        <h3>Dashboard</h3>
        {/* You can add inventory links, reports, etc. here */}
      </div>

      <LogoutButton onLogout={onLogout} />
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '60px auto',
    background: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  section: {
    marginTop: '30px',
    padding: '20px',
    borderTop: '1px solid #eee',
  },
};