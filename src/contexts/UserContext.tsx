import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

type MembershipTier = 'free' | 'premium';

interface UserContextType {
  membership: MembershipTier;
  setMembership: (tier: MembershipTier) => void;
  isPremium: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [membership, setMembershipState] = useState<MembershipTier>(() => {
    const saved = localStorage.getItem('userMembership');
    return (saved as MembershipTier) || 'free';
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        if (u.email === 'mcalebr04@gmail.com') {
          setMembershipState('premium');
          localStorage.setItem('userMembership', 'premium');
        } else {
          // Si entra otro correo, se valida si tiene Premium comprado localmente, sino inicia como Free
          const saved = localStorage.getItem('userMembership');
          if (saved === 'premium') {
            setMembershipState('premium');
          } else {
            setMembershipState('free');
            localStorage.setItem('userMembership', 'free');
          }
        }
      } else {
        // Cerrado de sesión
        const saved = localStorage.getItem('userMembership');
        setMembershipState((saved as MembershipTier) || 'free');
      }
    });
    return () => unsubscribe();
  }, []);

  const setMembership = (tier: MembershipTier) => {
    setMembershipState(tier);
    localStorage.setItem('userMembership', tier);
  };

  const isPremium = membership === 'premium';

  return (
    <UserContext.Provider value={{ membership, setMembership, isPremium }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
