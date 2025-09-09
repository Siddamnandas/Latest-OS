export default function MobileOnlyPage() {
  return (
    <div style={{display:'flex',minHeight:'100vh',alignItems:'center',justifyContent:'center',padding:'2rem',textAlign:'center'}}>
      <div>
        <h1 style={{fontSize:'2rem',marginBottom:'1rem'}}>Mobile App Only</h1>
        <p>This service is available only through our iOS and Android apps.</p>
        <p>Please open the app to continue.</p>
      </div>
    </div>
  );
}

