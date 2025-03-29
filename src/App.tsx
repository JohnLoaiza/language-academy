import { MultiProjectsRoutes } from 'backless';
import { languageAcademy } from './projects/languageAcademy';

function App() {
  return (
    <MultiProjectsRoutes
      suscribeProjects={[languageAcademy]}
    ></MultiProjectsRoutes>
  );
}

export default App
