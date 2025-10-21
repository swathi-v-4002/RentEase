import React from 'react';
import { Link } from 'react-router-dom';

const ListIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
);

const RentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const SecureIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);


function LandingPage() {
    return (
    <div>
            {/* Hero Section */}
            <header style={{background: 'linear-gradient(90deg, #5f0ceeff 0%, #a37ae3ff 100%)', color: '#fff', padding: '5rem 0', textAlign: 'center'}}>
                <div>
                    <h1 style={{fontSize: '3rem', fontWeight: 700, marginBottom: '1rem', color: '#ffffffff'}}>Rent Anything.Anywhere.Anytime.</h1>
                    <p style={{fontSize: '1.25rem', marginBottom: '2rem'}}>The secure and easy-to-use community marketplace for renting goods.</p>
                    <Link to="/home" className="btn btn-primary">Explore Items</Link>
                </div>
            </header>

            {/* Features Section */}
            <section style={{padding: '5rem 0', background: 'var(--background-color)'}}>
                <h2 style={{textAlign: 'center', fontSize: '2.5rem', fontWeight: 700, marginBottom: '3rem', color: 'var(--primary-color)', letterSpacing: '-0.5px',}}>Why Choose Us?</h2>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem', maxWidth: '900px', margin: '0 auto', padding: '0 2rem'}}>
                    <div style={{background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '1rem', padding: '2rem', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)'}}>
                        <ListIcon />
                        <h3 style={{fontSize: '1.25rem', fontWeight: 600, margin: '1rem 0'}}>List Your Items</h3>
                        <p style={{color: 'var(--subtle-text-color)'}}>Earn money by renting out your unused items to people nearby.</p>
                    </div>
                    <div style={{background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '1rem', padding: '2rem', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)'}}>
                        <RentIcon />
                        <h3 style={{fontSize: '1.25rem', fontWeight: 600, margin: '1rem 0'}}>Rent Anything</h3>
                        <p style={{color: 'var(--subtle-text-color)'}}>Find what you need, from power tools to party supplies, right in your neighborhood.</p>
                    </div>
                    <div style={{background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '1rem', padding: '2rem', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)'}}>
                        <SecureIcon />
                        <h3 style={{fontSize: '1.25rem', fontWeight: 600, margin: '1rem 0'}}>Secure & Easy</h3>
                        <p style={{color: 'var(--subtle-text-color)'}}>A seamless rental process with secure and trusted user community.</p>
                    </div>
                </div>
            </section>

             {/* How It Works Section */}
            <section style={{padding: '4rem 0', background: 'var(--surface-color)'}}>
                <h2 style={{textAlign: 'center', fontSize: '2rem', fontWeight: 700, marginBottom: '2.5rem', color: 'var(--primary-color)'}}>How It Works</h2>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', maxWidth: '900px', margin: '0 auto'}}>
                    <div style={{flex: '1 1 220px', background: 'var(--background-color)', borderRadius: '1rem', padding: '2rem', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'}}>
                        <div style={{fontSize: '2rem', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '0.5rem'}}>1</div>
                        <h3 style={{fontSize: '1.1rem', fontWeight: 600}}>Create an Account</h3>
                        <p style={{color: 'var(--subtle-text-color)'}}>Sign up in minutes and get ready to start renting or listing.</p>
                    </div>
                    <div style={{fontSize: '2rem', color: 'var(--primary-color)', fontWeight: 700}}>&rarr;</div>
                    <div style={{flex: '1 1 220px', background: 'var(--background-color)', borderRadius: '1rem', padding: '2rem', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'}}>
                        <div style={{fontSize: '2rem', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '0.5rem'}}>2</div>
                        <h3 style={{fontSize: '1.1rem', fontWeight: 600}}>Browse or List</h3>
                        <p style={{color: 'var(--subtle-text-color)'}}>Search for items you need or list your own items for others to rent.</p>
                    </div>
                    <div style={{fontSize: '2rem', color: 'var(--primary-color)', fontWeight: 700}}>&rarr;</div>
                    <div style={{flex: '1 1 220px', background: 'var(--background-color)', borderRadius: '1rem', padding: '2rem', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'}}>
                        <div style={{fontSize: '2rem', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '0.5rem'}}>3</div>
                        <h3 style={{fontSize: '1.1rem', fontWeight: 600}}>Connect & Transact</h3>
                        <p style={{color: 'var(--subtle-text-color)'}}>Arrange rental details and make secure payments through our platform.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{background: 'var(--primary-color)', color: '#fff', textAlign: 'center', padding: '3.5rem 0',fontSize: '12px', marginTop: '3rem'}}>
                <p style={{margin: 0}}>&copy; 2025 RentEase. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default LandingPage;
