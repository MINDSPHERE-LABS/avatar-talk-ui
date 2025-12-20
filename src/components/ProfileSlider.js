import React from 'react';
import ProfileCard from './ProfileCard';
import '../../src/pages/HomePage.css';

const ProfileSlider = ({ title, profiles, onViewProfile }) => {
  const handleProfileClick = (profile) => {
    onViewProfile(profile);
  };

  return (
    <div className="slider-section">
      <h2 className="section-title">{title}</h2>
      <div className="slider-container">
        <div className="profiles-slider">
          {profiles.map(profile => (
            <ProfileCard 
              key={profile.id} 
              profile={profile} 
              onViewProfile={handleProfileClick}
              showIndiaBadge={true}
              showAdultBadge={profile.isAdult}
              consistentLayout={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSlider;