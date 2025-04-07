interface IUserImageUrl {
    userProfilePictureUrl: string;
}

interface IUserProfilePictureUrl {
    success: boolean,
    message: string,
    data: IUserImageUrl;
}

export default IUserProfilePictureUrl;
