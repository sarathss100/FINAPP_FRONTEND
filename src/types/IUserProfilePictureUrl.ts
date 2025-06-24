interface IUserImageUrl {
    profilePictureUrl: string,
}

interface IUserProfilePictureUrl {
    success: boolean,
    message: string,
    data: IUserImageUrl;
}

export default IUserProfilePictureUrl;


export interface IUserProfilePicture {
    success: boolean,
    message: string,
    data: {
        image: string,
        contentType: string,
        extention: string,
    }
}
