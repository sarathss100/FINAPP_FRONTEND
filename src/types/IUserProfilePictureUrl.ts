interface IUserImageUrl {
    profilePictureUrl: string;
}

interface IUserProfilePictureUrl {
    success: boolean,
    message: string,
    data: IUserImageUrl;
}

export default IUserProfilePictureUrl;
