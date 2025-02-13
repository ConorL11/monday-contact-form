import React, { createContext, useContext, useState, useEffect } from "react";
import mondaySdk from "monday-sdk-js";

const MondayContext = createContext();


// function to grab monday SDK, monday context, and supported column names, and place them in a context provider
export const MondayProvider = ({ children }) => {
  const [monday, setMonday] = useState(null);
  const [mondayContext, setMondayContext] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const mondayClient = mondaySdk();
    setMonday(mondayClient);

    // get monday context and store it in state
    mondayClient.get("context").then((response) => {
      setMondayContext(response.data);
      setIsLoading(false);
    });
  }, []);


  //load display in case of long context retrievals
  if (isLoading) {
    return <div>Loading context...</div>;
  }

  return (
    <MondayContext.Provider value={{ monday, mondayContext }}>
      {children}
    </MondayContext.Provider>
  );
};

// hook for handling monday context
export const useMondayContext = () => {
  const context = useContext(MondayContext);

  // throw an error when we are unable to retrieve the monday context
  if (!context) {
    throw new Error("This application needs to be used inside of a valid monday board");
  }
  return context;
};
