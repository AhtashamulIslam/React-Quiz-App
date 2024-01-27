import {
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth';
import React, { useContext, useEffect, useState } from "react";
import '../firebase';
const AuthConst=React.createContext()

export function useAuth(){
    return useContext(AuthConst)
}

export function AuthProvider({children}){
    const [loading,setLoading]=useState(true);
    const [currentUser,setCurrentUser]=useState();

    useEffect(()=>{
         const auth=getAuth()
         const unsubscribed=onAuthStateChanged(auth,(user)=>{
            setCurrentUser(user)
            setLoading(false)
         })
         return unsubscribed
    },[])

    async function signup(email,password,username){
          const auth=getAuth()
          await createUserWithEmailAndPassword(auth,email,password)

          await updateProfile(auth.currentUser,{
            displayName:username
          })

          const user=auth.currentUser
          setCurrentUser({
            ...user
          })
    }

    function login(email,password){
        const auth=getAuth()
        return signInWithEmailAndPassword(auth,email,password)
    }
    
    function logout(){
        const auth=getAuth()
        return signOut(auth)
    }

    const value={
        currentUser,
        signup,
        login,
        logout,
     }
    return (
        <AuthConst.Provider value={value}>
           {!loading && children}
        </AuthConst.Provider>
    )
}