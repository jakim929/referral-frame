export const BaseLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        fontFamily: 'sans-serif',
        background: '#160f29',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyItems: 'center',
          padding: '40px',
          color: 'white',
        }}
      >
        <h1
          style={{
            fontSize: '60px',
            fontWeight: '500',
            margin: '0',
            fontFamily: 'Bitter',
          }}
        >
          {children}
        </h1>
      </div>
    </div>
  )
}
