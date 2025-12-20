import React from 'react';

const ProfileCard = ({ profile, onViewProfile }) => {
  const handleImageClick = () => {
    onViewProfile(profile);
  };

  return (
    <div className="profile-card">
      <div className="profile-img-container">
        {profile.image ? (
          <img 
            src={profile.image} 
            alt={profile.name} 
            className="profile-img"
            onClick={handleImageClick}
            style={{ cursor: 'pointer' }}
          />
        ) : (
          <div 
            className="profile-placeholder"
            onClick={handleImageClick}
            style={{ cursor: 'pointer' }}
          >
            <i className="fas fa-user"></i>
          </div>
        )}
        {profile.isAdult && <div className="adult-badge">18+</div>}
      </div>
      <div className="profile-info">
        <h3 className="profile-name">{profile.name}</h3>
        <p className="profile-bio">{profile.bio}</p>
        <div className="latest-character">Latest: {profile.latestCharacter}</div>
        <button 
          className="view-profile-btn"
          onClick={() => onViewProfile(profile)}
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;