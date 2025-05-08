// components/Dashboard.tsx
import React, { useEffect, useState } from "react";
import '../utils/styles.css';
import { useNavigate, useParams } from "react-router-dom";
import { PrivateAdmin } from "../../projectsManager";
import Sidebar from "./components/Sidebar";
import ModuleContent from "./ModuleContent";
import EditModal from "./components/editModal";
import { Sesion } from "../../sesionManager";
import { Rol } from "../../projectsManager/models/ProjectPropiertiesModel";
import { Module } from "../../projectsManager/models/moduleModel";
import { MainRoutes } from "../../routesManager/multiProjectRoutes";

export interface Settings {
  sesion: false;
  userId: "";
}

export interface User {
  roles: Rol[];
  username: string;
}

const Dashboard: React.FC = () => {
  const { module } = useParams<{ module: string }>();

  const storage = sessionStorage.getItem("settings");
  const navigate = useNavigate();

  const settings: Settings = storage
    ? JSON.parse(storage)
    : {
        sesion: false,
        userId: "",
      };

  const moduleObject = Sesion.props.authorizeModules.find(
    (m) => m.name === module
  );

  const [selectedModule, setSelectedModule] = useState<Module>(
    moduleObject ?? { name: "home", component: <></> }
  );
  const [loading, setLoading] = useState(false);
  const [editModal, setEditModal] = useState({
    editAs: "",
    flag: false,
    obj: undefined,
    indexEdit: 0,
    mapList: [],
    doc: undefined,
    asEdit: false,
    addDoc: () => {},
    editDoc: () => {},
    indexList: [],
  });

  const handleChange = (module: Module) => {
    navigate(PrivateAdmin.generateProjectRoute(MainRoutes.MODULE, module.name));
    setLoading(true);
    setTimeout(() => {
      setSelectedModule(module);
      setLoading(false);
    }, 100);
  };

  useEffect(() => {
    if (settings.sesion) {
    } else {
      navigate(PrivateAdmin.generateProjectRoute(MainRoutes.LOGIN));
    }
  }, []);

  return (
    <div className={'dashboard'}>
      <Sidebar userSettings={Sesion.props.user} onSelectModule={handleChange} />
      <div  className={'content'}>
        <h1>{selectedModule.name}</h1>
        {!loading ? (
          <ModuleContent
            userSettings={Sesion.props.user}
            module={selectedModule}
            setEditModal={setEditModal}
          />
        ) : (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        )}
      </div>
      {editModal.flag ? (
        <EditModal
          editAs={editModal.editAs}
          indexEdit={editModal.indexEdit}
          addDoc={editModal.addDoc}
          asEdit={editModal.asEdit}
          editDoc={editModal.editDoc}
          indexList={editModal.indexList}
          doc={editModal.doc}
          onClose={() =>
            setEditModal({
              editAs: "",
              obj: undefined,
              indexEdit: 0,
              mapList: [],
              flag: false,
              doc: undefined,
              asEdit: false,
              addDoc: () => {},
              editDoc: () => {},
              indexList: [],
            })
          }
          obj={editModal.obj}
          mapList={editModal.mapList}
        ></EditModal>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Dashboard;
