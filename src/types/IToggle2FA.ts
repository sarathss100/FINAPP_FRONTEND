
interface IToggle2FA {
    success: boolean,
    message: string,
    data: {
        isToggled: boolean
    };
}

export default IToggle2FA;
