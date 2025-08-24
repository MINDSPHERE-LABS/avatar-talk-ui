import React, { useState, useEffect } from 'react';
import ProfileSlider from '../components/ProfileSlider';
import { getProfileById, getAllProfiles } from '../services/profileService';
import './ProfilePage.css';

const ProfilePage = ({ profile, onNavigate }) => {
  const [fullProfile, setFullProfile] = useState(null);
  const [relatedProfiles, setRelatedProfiles] = useState([]);

  useEffect(() => {
    if (profile) {
      // Get full profile details by ID
      const profileDetails = getProfileById(profile.id);
      setFullProfile(profileDetails);

      // Get related profiles (all except current)
      const allProfiles = getAllProfiles();
      const related = allProfiles.filter(p => p.id !== profile.id).slice(0, 3);
      setRelatedProfiles(related);
    }
  }, [profile]);

  const handleViewProfile = (profile) => {
    onNavigate('profile', profile);
  };

  const handleStartChat = () => {
    if (!fullProfile) return;
    const botUsername = "Proff_Minakshi_bot";
    const chatUrl = `https://t.me/${botUsername}?start=p_${fullProfile.profileKey}`;
    window.open(chatUrl, '_blank');
  };

  if (!fullProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        {/* Profile Image Container */}
        <div className="profile-image-container">
          <img src={fullProfile.image} alt={fullProfile.name} />
          
          {/* Name Overlay at bottom left corner with Chat Button */}
          <div className="profile-name-overlay">
            <h2>{fullProfile.name}</h2>
            <button className="chat-now-btn" onClick={handleStartChat}>
              <i className="fab fa-telegram"></i> Chat Now
            </button>
          </div>
          
          {/* India Location Badge */}
          <div className="india-badge">
            <i className="fas fa-map-marker-alt"></i>
            <span>India</span>
          </div>
          
          {fullProfile.isAdult && <div className="adult-badge">18+</div>}
        </div>
        
        {/* Profile Bio Container - Overlaps the image */}
        <div className="profile-bio-container">
          <p className="profile-description">{fullProfile.bio}</p>
        </div>
      </div>

      <div className="profile-attributes">
        {/* Personality Section - MOVED FROM BIO CONTAINER */}
        {fullProfile.personality && (
          <div className="attribute-box">
            <h3 className="attribute-title"><i className="fas fa-user"></i> Personality</h3>
            <p>{fullProfile.personality}</p>
          </div>
        )}

        {/* Likes Section */}
        {fullProfile.likes && fullProfile.likes.length > 0 && (
          <div className="attribute-box">
            <h3 className="attribute-title"><i className="fas fa-heart"></i> Likes</h3>
            <ul className="attribute-list">
              {fullProfile.likes.map((like, index) => (
                <li key={index}>{like}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Dislikes Section */}
        {fullProfile.dislikes && fullProfile.dislikes.length > 0 && (
          <div className="attribute-box">
            <h3 className="attribute-title"><i className="fas fa-times-circle"></i> Dislikes</h3>
            <ul className="attribute-list">
              {fullProfile.dislikes.map((dislike, index) => (
                <li key={index}>{dislike}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Interests Section */}
        {fullProfile.interests && fullProfile.interests.length > 0 && (
          <div className="attribute-box">
            <h3 className="attribute-title"><i className="fas fa-star"></i> Interests</h3>
            <ul className="attribute-list">
              {fullProfile.interests.map((interest, index) => (
                <li key={index}>{interest}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Dialogue Style Section */}
      {fullProfile.dialogueStyle && (
        <>
          <h2 className="section-title">Dialogue Style</h2>
          <div className="dialogue-style">
            <p>{fullProfile.dialogueStyle}</p>
            {fullProfile.sampleDialogues && fullProfile.sampleDialogues.length > 0 && (
              <>
                <p>Here are some sample dialogues:</p>
                <div className="sample-dialogues">
                  {fullProfile.sampleDialogues.map((dialogue, index) => (
                    <div key={index} className="dialogue-item">
                      "{dialogue}"
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* Related Profiles Slider */}
      {relatedProfiles.length > 0 && (
        <ProfileSlider
          title="Explore More Characters"
          profiles={relatedProfiles}
          onViewProfile={handleViewProfile}
        />
      )}
    </div>
  );
};

export default ProfilePage;