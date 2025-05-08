import React, { useEffect, useState } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import axios from "axios";
import { apiRoute, setSesionTime } from "../../configs";
import { Admin, PrivateAdmin } from "..";
import { Module } from "../models/moduleModel";
import { Sesion, SesionProps } from "../../sesionManager";
import { MainRoutes } from "../../routesManager/multiProjectRoutes";

interface ProtectedRouteProps {
  element: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { module = "home" } = useParams<{ module: string }>();
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [allpermitedRutes] = useState<string[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUserAndRoutes = async () => {
      try {
        // Obtener datos de sesión
        const sessionData = JSON.parse(
          sessionStorage.getItem("settings") || "{}"
        );
        const token = sessionData?.jwt;
        const userId = sessionData?.userId;

        if (!token) {
          setIsValid(false);
          return;
        }

        // Verificar token y obtener datos del usuario
        const userResponse = await axios.get(
          `${apiRoute}/${Admin.projectSelected!.props.name}/users/${userId}`
        );

        const userRoles = userResponse.data.properties.roles;
        console.log(userRoles);
        const projectRoles = Admin.projectSelected!.props.roles;
        
        console.log(projectRoles);

        // Obtener rutas

        var acumuloModules: Module[] = [];
        console.log('pre es');
        console.log(acumuloModules);
        
        projectRoles.forEach((r) => {
          if (userRoles.includes(r.name)) {
            acumuloModules = [...acumuloModules, ...r.authorizedModules] ;
          }
        });
        const authotizedModules: Module[] = acumuloModules.length === 0 ? [] as Module[] : acumuloModules
        console.log('autorizados es');
        console.log(authotizedModules);
        
        const sesionProps: SesionProps = {
          user: userResponse.data.properties,
          jwt: token,
          authorizeModules: authotizedModules,
          logged: true,
          time: 0,
        };
        console.log('sesion props es');
        console.log(sesionProps);
        
        Sesion.initSesion(sesionProps);

        // Validar rutas permitidas
        if (
         module.toUpperCase() !== "HOME" &&
          !acumuloModules.map((m) => m.name).includes(module)
        ) {
          alert("No tienes acceso a este modulo");
          navigate(PrivateAdmin.generateProjectRoute(MainRoutes.MAIN));
          return;
        }

        // Verificar token en el servidor
        const tokenResponse = await axios.post(
          `${apiRoute}/${Admin.projectSelected!.props.name}/users/verify-token`,
          { token }
        );
        if (tokenResponse.data.success) {
          setSesionTime(tokenResponse.data.timeRemaining);
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } catch (error) {
        console.error("Error verificando usuario y rutas:", error);
        setIsValid(false);
        navigate(PrivateAdmin.generateProjectRoute(MainRoutes.LOGIN));
      }
    };

    verifyUserAndRoutes();
  }, [module]); // Dependencia en module para que se revalide cuando cambie

  if (isValid === null) {
    // Puedes mostrar un cargando o una transición mientras se verifica
    return <div>Loading...</div>;
  }

  if (!isValid) {
    // Si el token no es válido, redirige al login
    return <Navigate to={PrivateAdmin.generateProjectRoute(MainRoutes.LOGIN)} state={{ from: location }} />;
  }
  console.log("module es " + module);
  console.log("lista de rutas para este user es ");
  console.log(allpermitedRutes);
  console.log("valie es " + isValid);

  return (
    <>
      {element}
    </>
  );

  // Si el token es válido, renderiza el componente protegido
};

export default ProtectedRoute;
