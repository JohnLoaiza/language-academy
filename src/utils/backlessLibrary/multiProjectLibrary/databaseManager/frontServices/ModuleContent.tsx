// components/ModuleContent.tsx
import {sesionTime } from '../../configs';
import CountdownTimer from './components/viewSesionTime';
import Table from './tableView';
import { Admin } from '../../projectsManager';
import { User } from './dashboard';
import { Module } from '../../projectsManager/models/moduleModel';

interface ModuleContentProps {
    module: Module;
    setEditModal: any
    userSettings: User
}

const ModuleContent = ({ module, userSettings }: ModuleContentProps) => {
  
    const rolColor = (rol: string) => {
        switch (rol) {
            case 'Admin':
                return '#1abc9c';
            case 'Profesor':
                return '#1a63bc';
            case 'Estudiante':
                return '#9aa738';
            default:
                return '#E1A6A2FF';
        }
    };

    const renderModuleContent = () => {
        switch (module.name.toUpperCase()) {
            case 'HOME':
                return (
                    <div style={{ width: "100%", maxWidth: "800px", textAlign: "center" }}>
                        <h2>Tus roles activos son:</h2>
                        {userSettings.roles.map(r => r.name).map((r) => (
                            <div key={r} style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center" }}>
                                <div style={{ backgroundColor: rolColor(r), height: "20px", width: "20px", borderRadius: "50%" }}></div>
                                <span>{r}</span>
                            </div>
                        ))}
                        <CountdownTimer initialTime={sesionTime} />
                    </div>
                );
            default:
                return module.component ?? <Table project={Admin.projectSelected!.props.name} collection={module.name} />;
        }
    };

    return renderModuleContent();
};

export default ModuleContent;
