import React from 'react';

function Home() {
  return (
    <div>
      <div style={{ paddingTop: '56px' }}> {/* Dodajemo padding na vrh sadržaja kako bi bio vidljiv ispod fiksiranog navbara */}
        <div className="container">
          <div className="row justify-content-center align-items-center vh-100">
            <div className="col-12">
              <div className='card my-5' style={{ 
                background: '#DDDEE5', /* Fallback boja */
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' /* Dodajemo sjenu */
              }}>
                <div className='card-body p-5 d-flex flex-column align-items-center'>
                  <h2 className="fw-bold mb-4 text-uppercase text-center">Welcome to Our Website</h2> {/* Centriramo naslov */}
                  <p className="text-muted text-center mb-5">Explore the possibilities with us!</p>

                  <div className='mb-4 mx-5 w-100 text-center'>
                    <p className="mb-0">Discover innovative solutions tailored just for you.</p>
                    <p className="mb-0">Join us and revolutionize your experience!</p>
                  </div>

                  {/* Dodajte banere i ostale marketinške elemente */}
                  <div className="d-flex justify-content-center">
                    <img src="banner1.jpg" alt="Banner 1" className="mx-3" style={{ maxWidth: '300px' }} />
                    <img src="banner2.jpg" alt="Banner 2" className="mx-3" style={{ maxWidth: '300px' }} />
                    <img src="banner3.jpg" alt="Banner 3" className="mx-3" style={{ maxWidth: '300px' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;