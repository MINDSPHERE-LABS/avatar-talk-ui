import profilesData from '../data/profiles.json';

export const getAllProfiles = () => {
  return profilesData.profiles ;
  // return profilesData;
};

export const getProfileById = (id) => {
  //  const allProfiles = getAllProfiles();
  return profilesData.profiles.find(profile => profile.id === parseInt(id));
};

export const getProfileByKey = (profileKey) => {
  return profilesData.profiles.find(profile => profile.profileKey === profileKey);
};

export const getFeaturedProfiles = (count = 4) => {
  return profilesData.profiles.slice(0, count);
};

// KEEP ONLY THIS VERSION - Remove the commented one above
export const getMoreProfiles = (offset = 0, count = null) => {
  if (count === null) {
    // Return all profiles from offset
    return profilesData.profiles.slice(offset);
  }
  return profilesData.profiles.slice(offset, offset + count);
};

// You can remove this duplicate function - it's the same as getAllProfiles()
// export const getAllProfilesForGrid = () => {
//   return profilesData.profiles;
// };