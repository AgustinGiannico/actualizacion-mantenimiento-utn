export const closeSession = (req, res) => {
    if (!req.cookies.jwt) {
        return res.status(400).json({ message: 'No hay sesión activa' });
    }

    res.clearCookie('jwt', {
        httpOnly: false,
        secure: false,
        sameSite: 'Lax',
        path: '/',
    });

    res.status(200).json({ message: 'Logout exitoso' });
};
