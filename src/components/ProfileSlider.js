import React from 'react';
import ProfileCard from './ProfileCard';

const ProfileSlider = ({ title, profiles, onViewProfile }) => {
  return (
    <div className="slider-section">
      <h2 className="section-title">{title}</h2>
      <div className="slider-container">
        <div className="profiles-slider">
          {profiles.map(profile => (
            <ProfileCard 
              key={profile.id} 
              profile={profile} 
              onViewProfile={onViewProfile}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSlider;