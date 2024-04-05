import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function AuthGuard({ children, roles }) {
    const navigate = useNavigate();

    useEffect(() => {
        const userRole = Cookies.get('role');

        if (!userRole) {
            navigate('/');
            return;
        }

        const hasNecessaryRole = roles.includes(userRole);

        if (!hasNecessaryRole) {
            navigate('/');
            return;
        }
    }, [roles, navigate]);

    return (
        <>
            { children }
        </>
    );
}
