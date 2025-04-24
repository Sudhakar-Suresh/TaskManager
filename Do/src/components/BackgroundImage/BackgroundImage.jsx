import React, { useState, useEffect } from 'react';
import './BackgroundImage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPalette, faTimes } from '@fortawesome/free-solid-svg-icons';

// Import all background images
import bg1 from '../../assets/background/1136887.jpg';
import bg2 from '../../assets/background/2544009.jpg';
import bg3 from '../../assets/background/1519264.webp';
import bg4 from '../../assets/background/393365.webp';
import bg5 from '../../assets/background/1612161.jpg';
import bg6 from '../../assets/background/1855642.webp';
import bg7 from '../../assets/background/1328098.jpg';
import bg8 from '../../assets/background/1691270.jpg';
import bg9 from '../../assets/background/2555858.jpg';
import bg10 from '../../assets/background/1208749.jpg';
import bg11 from '../../assets/background/1745569.png';
import bg12 from '../../assets/background/357639.jpg';
import bg13 from '../../assets/background/1837687.jpg';
import bg14 from '../../assets/background/152588.jpg';
import bg15 from '../../assets/background/386761.jpg';
import bg16 from '../../assets/background/356946.jpg';
import bg17 from '../../assets/background/97447.jpg';
import bg18 from '../../assets/background/133878.jpg';
import bg19 from '../../assets/background/12844.jpg';
import bg20 from '../../assets/background/7266862.jpg';

const BackgroundImage = ({ onBackgroundChange }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState('bg1');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Background image options
  const backgrounds = [
    { id: 'bg1', src: bg1, alt: 'Background 1' },
    { id: 'bg2', src: bg2, alt: 'Background 2' },
    { id: 'bg3', src: bg3, alt: 'Background 3' },
    { id: 'bg4', src: bg4, alt: 'Background 4' },
    { id: 'bg5', src: bg5, alt: 'Background 5' },
    { id: 'bg6', src: bg6, alt: 'Background 6' },
    { id: 'bg7', src: bg7, alt: 'Background 7' },
    { id: 'bg8', src: bg8, alt: 'Background 8' },
    { id: 'bg9', src: bg9, alt: 'Background 9' },
    { id: 'bg10', src: bg10, alt: 'Background 10' },
    { id: 'bg11', src: bg11, alt: 'Background 11' },
    { id: 'bg12', src: bg12, alt: 'Background 12' },
    { id: 'bg13', src: bg13, alt: 'Background 13' },
    { id: 'bg14', src: bg14, alt: 'Background 14' },
    { id: 'bg15', src: bg15, alt: 'Background 15' },
    { id: 'bg16', src: bg16, alt: 'Background 16' },
    { id: 'bg17', src: bg17, alt: 'Background 17' },
    { id: 'bg18', src: bg18, alt: 'Background 18' },
    { id: 'bg19', src: bg19, alt: 'Background 19' },
    { id: 'bg20', src: bg20, alt: 'Background 20' }
  ];
  
  // Set initial background on component mount
  useEffect(() => {
    // Set default background
    const initialBg = backgrounds.find(bg => bg.id === selectedBackground);
    if (initialBg) {
      applyBackground(initialBg);
    }
  }, []);
  
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  
  const applyBackground = (background) => {
    // Apply the selected background to the document
    document.body.style.backgroundImage = `url(${background.src})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
    
    // If there's a callback for background change, call it
    if (onBackgroundChange) {
      onBackgroundChange(background.src);
    }
  };
  
  const selectBackground = (background) => {
    setSelectedBackground(background.id);
    applyBackground(background);
    
    // Save selection to localStorage
    localStorage.setItem('selectedBackground', background.id);
    
    // Close the modal
    setShowModal(false);
  };
  
  // Filter backgrounds based on search term
  const filteredBackgrounds = searchTerm 
    ? backgrounds.filter(bg => bg.alt.toLowerCase().includes(searchTerm.toLowerCase()))
    : backgrounds;
  
  return (
    <>
      <div className="background-button-container">
        <button 
          className="background-toggle-button" 
          onClick={toggleModal}
          aria-label="Change background"
          style={{
            backgroundImage: `url(${backgrounds.find(bg => bg.id === selectedBackground)?.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="button-overlay">
            <FontAwesomeIcon icon={faPalette} className="palette-icon" />
          </div>
        </button>
      </div>
      
      {showModal && (
        <div className="background-modal-overlay">
          <div className="background-modal">
            <div className="modal-header">
              <h2>Choose your background<span className="dot">.</span></h2>
              <button 
                className="close-modal-button" 
                onClick={toggleModal}
                aria-label="Close modal"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <div className="search-container">
              <input 
                type="text" 
                placeholder="Search backgrounds" 
                className="background-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="background-grid">
              {filteredBackgrounds.map(background => (
                <div 
                  key={background.id}
                  className={`background-item ${selectedBackground === background.id ? 'selected' : ''}`}
                  onClick={() => selectBackground(background)}
                >
                  <img 
                    src={background.src} 
                    alt={background.alt} 
                    loading="lazy"
                  />
                </div>
              ))}
              
              {filteredBackgrounds.length === 0 && (
                <div className="no-results">
                  <p>No backgrounds match your search. Try different keywords.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BackgroundImage; 