import React, { useState, useEffect } from 'react';
import ProfileSlider from '../components/ProfileSlider';
import { getAllProfiles, getFeaturedProfiles } from '../services/profileService';
import './HomePage.css';

const HomePage = ({ onNavigate }) => {
  const [profiles, setProfiles] = useState([]);
  const [featuredProfiles, setFeaturedProfiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const allProfiles = getAllProfiles();
    setProfiles(allProfiles);
    setFeaturedProfiles(getFeaturedProfiles(6));
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const filtered = profiles.filter(profile =>
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.latestCharacter.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSearchResults(filtered);
    setIsSearching(true);
  }, [searchQuery, profiles]);

  const handleViewProfile = (profile) => {
    onNavigate('profile', profile);
  };

  return (
    <div className="home-page">

      {/* 🔍 Search */}
      <div className="search-section">
        <div className="search-container">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            placeholder="Search characters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* 🧩 Main Content */}
      {!isSearching ? (
        <>
          {/* 🟦 GRID FIRST */}
          <h2 className="section-title">All Characters</h2>

          <div className="characters-grid">
            {profiles.map(profile => (
              <div key={profile.id} className="character-card">
                <div className="character-image">
                  <img
                    src={profile.image}
                    alt={profile.name}
                    onClick={() => handleViewProfile(profile)}
                    style={{ cursor: 'pointer' }}
                  />

                  {profile.isAdult && <div className="adult-badge">18+</div>}

                  {/* Chat Now Button (overlay, no size change) */}
                  {/* <button
                    className="chat-now-btn home-chat-btn"
                    onClick={() => {
                      if (!profile.botUsername) return;

                      const chatUrl = `https://t.me/${profile.botUsername}`;
                      const link = document.createElement('a');
                      link.href = chatUrl;
                      link.target = '_blank';
                      link.rel = 'noopener noreferrer';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    <i className="fab fa-telegram"></i> Chat
                  </button> */}
                </div>


                <div className="character-info">
                  <h3>{profile.name}</h3>
                  <p>{profile.bio}</p>
                  <button
                    className="view-profile-btn"
                    onClick={() => {
                      if (!profile.botUsername) return;

                      const chatUrl = `https://t.me/${profile.botUsername}`;
                      const link = document.createElement('a');
                      link.href = chatUrl;
                      link.target = '_blank';
                      link.rel = 'noopener noreferrer';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    <i className="fab fa-telegram"></i> Chat Now
                  </button>

                </div>
              </div>
            ))}
          </div>

          {/* 🔽 SLIDER AT BOTTOM */}
          <div style={{ marginTop: '60px' }}>
            <ProfileSlider
              title="🔥 Trending Characters"
              profiles={featuredProfiles}
              onViewProfile={handleViewProfile}
            />
          </div>
        </>
      ) : (
        <>
          {/* 🔎 Search Results */}
          <h2 className="section-title">
            Search Results ({searchResults.length})
          </h2>

          <div className="characters-grid">
            {searchResults.map(profile => (
              <div key={profile.id} className="character-card">
                <div className="character-image">
                  <img
                    src={profile.image}
                    alt={profile.name}
                    onClick={() => handleViewProfile(profile)}
                  />
                </div>

                <div className="character-info">
                  <h3>{profile.name}</h3>
                  <p>{profile.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  );
};

export default HomePage;
