import React from 'react';
import {Provider} from 'react-redux';

import './shared/styles/crema.less';
import {
    AppContextProvider,
    AppLayout,
    AppLocaleProvider,
    AppThemeProvider,
    AuthRoutes,
} from './@crema';
import configureStore from './redux/store';
import {BrowserRouter} from 'react-router-dom';
import {QueryClient, QueryClientProvider} from "react-query";
// import {ReactQueryDevtools} from "react-query/devtools";
import JWTAuthAuthProvider from "./@crema/services/auth/jwt-auth/JWTAuthProvider";
import {ReactQueryDevtools} from "react-query/devtools";

const store = configureStore();
const queryCLient = new QueryClient()
const App = () => (
    <QueryClientProvider client={queryCLient}>
        <AppContextProvider>
            <Provider store={store}>
                <AppThemeProvider>
                    <AppLocaleProvider>
                        <BrowserRouter >
                            <JWTAuthAuthProvider>
                                <AuthRoutes>
                                    <AppLayout/>
                                </AuthRoutes>
                            </JWTAuthAuthProvider>
                        </BrowserRouter>
                    </AppLocaleProvider>
                </AppThemeProvider>
            </Provider>
        </AppContextProvider>
         <ReactQueryDevtools initialIsOpen={false} position={'bottom-right'}/>
    </QueryClientProvider>
);

export default App;
