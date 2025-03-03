import React, { 
    createContext, 
    ReactNode, 
    useContext,
    useState,
    useEffect
} from 'react';

// const { CLIENT_ID } = process.env;
// const { REDIRECT_URI } = process.env;

import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthProviderProps {
    children: ReactNode
}

interface User {
    id: string;
    name: string;
    email: string;
    photo?: string;
}

interface IAuthContextData {
    user: User;
    signInWithGoogle(): Promise<void>;
    signInWithApple(): Promise<void>;
    signOut(): Promise<void>;
    userStorageLoading: boolean;
}

interface AuthorizationResponse {
    params: {
        access_token: string;
    };
    type: string; 
}

const AuthContext = createContext({} as IAuthContextData);

function AuthProvider({ children }: AuthProviderProps){
    const [user, setUser] = useState<User>({} as User); 
    const [userStorageLoading , setUserStorageLoading] = useState(true);

    const dataKey = '@blogpost:user';

    async function signInWithGoogle() {
        try {
            // await AsyncStorage.clear();
            const CLIENT_ID = '260655641588-931qi9ifvp6v0teu7b10g2b3vhekc7pq.apps.googleusercontent.com';
            const REDIRECT_URI = 'https://auth.expo.io/@r1quelme/blog_post'; 
            // as duas constantes acimas são dados sensiveis, 
            //que já tiveram seu tratamento na linha 8 e 9 e 
            //estão no arquivo .env que está no Git Ignore, 
            //mas para fins desse desáfio, deixei eles disponiveis
            const RESPONSE_TYPE = 'token';
            const SCOPE = encodeURI('profile email');

            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
            
            const { type, params } = await AuthSession
            .startAsync({ authUrl }) as AuthorizationResponse;
            
            if(type === 'success'){
                const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`);
                const userInfo = await response.json();

                const userLoggedIn = {
                    id: userInfo.id, 
                    email: userInfo.email,
                    name: userInfo.given_name,
                    photo: userInfo.picture
                  }
                              
                  setUser(userLoggedIn);
                  console.log(userLoggedIn)
                  AsyncStorage.setItem(dataKey, JSON.stringify(userLoggedIn));
            }

        } catch (error) {
            throw new Error(error);
        }
    }

    async function signInWithApple() {
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ]
            });

            if(credential){
                const name = credential.fullName!.givenName!;
                const photo = `https://ui-avatars.com/api/?name=${name}&length=1`;

                const userLogged = {
                    id: String(credential.user),
                    email: credential.email!,
                    name,
                     photo,
                }

                setUser(userLogged)
                await AsyncStorage.setItem(dataKey, JSON.stringify(userLogged));
            }

        } catch (error) {
            throw new Error(error)
        }
    }

    async function signOut(){
        setUser({} as User);
        await AsyncStorage.removeItem(dataKey)
    }

    useEffect(() => {
        async function loadUserStorageDate() {
            const userStoraged = await AsyncStorage.getItem(dataKey);

            if(userStoraged){
                const userLogged = JSON.parse(userStoraged) as User;
                setUser(userLogged)
            }
            setUserStorageLoading(false)
        }

        loadUserStorageDate()
    },[]);

    return (
        <AuthContext.Provider value={{ 
            user, 
            signInWithGoogle,
            signInWithApple,
            signOut,
            userStorageLoading
        }}>
            { children }
        </AuthContext.Provider>
    )
}

function useAuth(){
    const context = useContext(AuthContext)

    return context;
}

export { AuthProvider, useAuth }