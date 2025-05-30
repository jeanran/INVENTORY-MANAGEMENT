export default function LogoutButton({ onLogout }) {
  return (
    <button onClick={onLogout} style={btnStyle}>
      Logout
    </button>
  );
}

const btnStyle = {
  marginTop: '30px',
  padding: '10px 20px',
  fontWeight: 'bold',
  fontSize: '1rem',
  backgroundColor: '#172a45',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};