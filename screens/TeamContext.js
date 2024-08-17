import React, { createContext, useState, useContext } from "react";

const TeamContext = createContext();

export const TeamProvider = ({ children }) => {
  const [teamId, letsetTeamId] = useState(null);

  return (
    <TeamContext.Provider value={{ teamId, letsetTeamId }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => useContext(TeamContext);
