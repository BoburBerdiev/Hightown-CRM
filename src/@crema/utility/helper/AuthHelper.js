import {authRole} from '../../../shared/constants/AppEnums';

export const getUserFromAuth0 = (user) => {
    if (user)
        return {
            id: 1,
            uid: user.sub,
            displayName: user.first_name,
            email: user.email,
            photoURL: user.picture,
            role: authRole.user,
        };
    return user;
};

export const getUserFromFirebase = (user) => {
    if (user)
        return {
            id: 1,
            uid: user.uid,
            displayName: user.displayName ? user.displayName : 'Crema User',
            email: user.email,
            photoURL: user.photoURL ? user.photoURL : '/assets/images/avatar/A11.jpg',
            role: authRole.user,
        };
    return user;
};
export const getUserFromAWS = (user) => {
    if (user)
        return {
            id: 1,
            uid: user.username,
            displayName: user.attributes.name ? user.attributes.name : 'Crema User',
            email: user.attributes.email,
            photoURL: user.photoURL,
            role: authRole.user,
        };
    return user;
};

export const getUserFromJwtAuth = (user) => {

    if (user) {
        return {
            id: 1,
            uid: user?.id,
            displayName: user?.fulName,
            email: user?.email,
            photoURL: `${process.env.REACT_APP_IMAGE_URL}/${user?.image?.path}`,
            role: user.role === 1 ? authRole?.admin : authRole.user,
        };
    }

    else {
        return {
            id: 1,
            uid: 0,
            displayName: "",
            email: "user?.email",
            photoURL: ``,
            role: authRole?.admin,
        };
    }
};
