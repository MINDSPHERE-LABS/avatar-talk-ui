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
    // Load all profiles
    const allProfiles = getAllProfiles();
    setProfiles(allProfiles);
    
    // Load featured profiles (first 4 for slider)
    setFeaturedProfiles(getFeaturedProfiles(4));
  }, []);

  useEffect(() => {
    // Filter profiles based on search query
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setIsSearching(false);
    } else {
      const filtered = profiles.filter(profile =>
        profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.latestCharacter.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
      setIsSearching(true);
    }
  }, [searchQuery, profiles]);

  const handleViewProfile = (profile) => {
    onNavigate('profile', profile);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  return (
    <div className="home-page">
      {/* Search Input Section */}
      <div className="search-section">
        <div className="search-container">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            placeholder="Search characters by name, bio, or type..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={clearSearch}>
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
      </div>
       
      {/* Search Results */}
      {isSearching && (
        <div className="search-results">
          <h2 className="section-title">
            Search Results for "{searchQuery}"
            {searchResults.length > 0 && ` (${searchResults.length} found)`}
          </h2>
          
          {searchResults.length === 0 ? (
            <div className="no-results">
              <p>No characters found matching your search.</p>
            </div>
          ) : (
            <div className="search-results-grid">
              {searchResults.map(profile => (
                <div key={profile.id} className="character-card">
                  <div className="character-image">
                    <img 
                      src={profile.image} 
                      alt={profile.name} 
                      onClick={() => handleViewProfile(profile)}
                      style={{ cursor: 'pointer' }}
                    />
                    {profile.isAdult && <div className="adult-badge">18+</div>}
                  </div>
                  <div className="character-info">
                    <h3>{profile.name}</h3>
                    <p>{profile.bio}</p>
                    <button 
                      className="view-profile-btn"
                      onClick={() => handleViewProfile(profile)}
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      

      {/* Show regular content only when not searching */}
      {!isSearching && (
        <>
          <ProfileSlider 
            title="Latest Characters" 
            profiles={profiles} 
            onViewProfile={handleViewProfile}
          />

          {/* All Characters Grid - Show ALL profiles */}
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
                </div>
                <div className="character-info">
                  <h3>{profile.name}</h3>
                  <p>{profile.bio}</p>
                  <button 
                    className="view-profile-btn"
                    onClick={() => handleViewProfile(profile)}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Featured Character Section - Show first profile */}
          {profiles.length > 0 && (
            <div className="featured-character">
              <div className="featured-image">
                <img 
                  src={profiles[0].image} 
                  alt={profiles[0].name} 
                  onClick={() => handleViewProfile(profiles[0])}
                  style={{ cursor: 'pointer' }}
                />
                <div className="adult-badge">18+</div>
              </div>
              <div className="featured-details">
                <h3>{profiles[0].name}</h3>
                <p>{profiles[0].bio}</p>
                <button 
                  className="view-profile-btn"
                  onClick={() => handleViewProfile(profiles[0])}
                >
                  View Profile
                </button>
              </div>
            </div>
          )}

          {/* Latest Scenes Section */}
          <div className="latest-scenes">
            <h2 className="section-title">Latest Scenes</h2>
            <div className="scenes-list">
              <div className="scene-item">
                <div className="scene-content">
                  <h4>Raho</h4>
                  <p>Minakshi, ko tickle kiya, aur... Read</p>
                </div>
              </div>
              <div className="scene-item">
                <div className="scene-content">
                  <h4>Pool Par Ignore</h4>
                  <p>Tumne dekha ki Tara pool par kisi aur bande ko... Read More</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="bot-reference">
        <p>@Aarushi_thakurmybot</p>
      </div>
    </div>
  );
};

export default HomePage;