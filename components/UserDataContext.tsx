import React, { createContext, ReactNode, useCallback, useContext, useState } from "react";

interface UserDataContextType {
    balance: number;
    updateBalance: (newBalance: number) => void;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

interface UserDataProviderProps {
    children: ReactNode;
}

export const UserDataProvider: React.FC<UserDataProviderProps> = ({ children }) => {
    const [balance, setBalance] = useState(0);

    const updateBalance = useCallback((newBalance: number) => {
        setBalance(newBalance);
    }, []);

    return <UserDataContext.Provider value={{ balance, updateBalance }}>{children}</UserDataContext.Provider>;
};

export const useUserData = () => {
    const context = useContext(UserDataContext);
    if (context === undefined) {
        throw new Error("useUserData must be used within a UserDataProvider");
    }
    return context;
};
