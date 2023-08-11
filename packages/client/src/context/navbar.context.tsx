import { createContext, ReactNode, FC, useState, useContext } from 'react';

interface NavbarContextProps {
  open: boolean;
  handleToggle: () => void;
}

const NavbarContext = createContext<NavbarContextProps>({} as NavbarContextProps);

interface NavbarProviderProps {
  children: ReactNode;
}

export const NavbarProvider: FC<NavbarProviderProps> = ({ children }) => {
  const [open, setOpen] = useState(false);

  const handleToggle = () => setOpen(!open);

  return (
    <NavbarContext.Provider
      value={{
        open,
        handleToggle
      }}
    >
      {children}
    </NavbarContext.Provider>
  );
};

export const useNavbar = () => {
  return useContext(NavbarContext);
};
