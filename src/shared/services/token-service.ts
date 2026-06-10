export const tokenService = {
    getToken: () => localStorage.getItem('token'),
    setToken: (token: string) => localStorage.setItem('token', token),
    removeToken: () => localStorage.removeItem('token'),
    isAuthenticated: (): boolean => {
        const token = localStorage.getItem('token');
        if (!token) return false;
        try {
            // JWTs use Base64URL encoding — must convert to standard Base64 before atob()
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
            const payload = JSON.parse(atob(padded));
            return typeof payload.exp === 'number' && Date.now() < payload.exp * 1000;
        } catch {
            return false;
        }
    },
};