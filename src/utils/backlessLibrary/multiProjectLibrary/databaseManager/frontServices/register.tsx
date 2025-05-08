import React, { useState } from 'react';
import axios from 'axios';
import  '../utils/styles.css';
import { apiRoute } from '../../configs';
import { Link, useNavigate } from 'react-router-dom';
import { Rol } from '../../projectsManager/models/ProjectPropiertiesModel';
import { Admin, PrivateAdmin } from '../../projectsManager';
import { MainRoutes } from '../../routesManager/multiProjectRoutes';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [_, setHashedPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [selectedRoles, setSelectedRoles] = useState<Rol[]>([]);
    const navigate = useNavigate()
    const rolesList: Rol[] = Admin.projectSelected!.props.roles;
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            // Primera solicitud para encriptar la contraseña
            const encryptResponse = await axios.post(`${apiRoute}/${Admin.projectSelected!.props.name}/users/encrypt`, {
                data: password
            });
            console.log(encryptResponse.data);
            
            // Almacenamos la contraseña encriptada
            const encryptedPassword = encryptResponse.data.hashedPassword;
            setHashedPassword(encryptedPassword);
            console.log('contraseña encriptada es');
            console.log(encryptedPassword);
            
            // Segunda solicitud para registrar el usuario con la contraseña encriptada
            const insertResponse = await axios.post(`${apiRoute}/${Admin.projectSelected!.props.name}/users/insert`, {
                username: username,
                password: encryptedPassword,
                roles: ['Student']
            });

            // Manejamos la respuesta exitosa del registro
            setMessage(insertResponse.data.message || 'Registro exitoso');
            alert('Registro exitoso, ya puedes iniciar sesión')
            navigate(PrivateAdmin.generateProjectRoute(MainRoutes.LOGIN)); // Redirige a la ruta principal
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleClick = (rol: Rol) => {
        setSelectedRoles(prevRoles =>
            prevRoles.includes(rol) ? prevRoles.filter(r => r !== rol) : [...prevRoles, rol]
        );
    };

    return (
        <div className={'formContainer'}>
            <form className={'form'} onSubmit={handleRegister}>
                <h1>Registro</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {message && <p style={{ color: 'green' }}>{message}</p>}

                <div className={'inputGroup'}>
                    <label className={'inputLabel'}>Nombre de usuario:</label>
                    <input
                        type="text"
                        className={'inputField'}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className={'inputGroup'}>
                    <label className={'inputLabel'}>Contraseña:</label>
                    <input
                        type="password"
                        className={'inputField'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <br></br>
                <button type="submit" className={'submitButton'}>
                    {loading ? 'Cargando...' : 'Registrar'}
                </button>
            </form>
            <p className={'registerPrompt'}>
                    ¿Ya tienes una cuenta?{' '}
                    <Link to={PrivateAdmin.generateProjectRoute(MainRoutes.LOGIN)} className={'registerLink'}>
                        Inicia sesión aquí
                    </Link>
                </p>
        </div>
    );
};

export default Register;
