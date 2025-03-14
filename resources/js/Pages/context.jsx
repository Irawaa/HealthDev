import { createContext, useContext } from "react";
import { usePage } from "@inertiajs/react";

// Create Contexts
export const CommonDiseasesContext = createContext();
export const PhysicianStaffContext = createContext();

// Custom Hooks for Using Contexts
export const useCommonDiseases = () => useContext(CommonDiseasesContext);
export const usePhysicianStaff = () => useContext(PhysicianStaffContext);

// Provider Component using Inertia.js data
export const DataProvider = ({ children }) => {
  const { commonDiseases, physicianStaff } = usePage().props; // Fetch data from Inertia

  return (
    <CommonDiseasesContext.Provider value={commonDiseases}>
      <PhysicianStaffContext.Provider value={physicianStaff}>
        {children}
      </PhysicianStaffContext.Provider>
    </CommonDiseasesContext.Provider>
  );
};
