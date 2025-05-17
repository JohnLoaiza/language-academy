import { languageAcademy, languageAcademyMarketing } from './projects/languageAcademy';
import { MultiProjectsRoutes } from './utils/backlessLibrary/multiProjectLibrary/routesManager/multiProjectRoutes';

function App() {
  return (
    <MultiProjectsRoutes
      suscribeProjects={[languageAcademy, languageAcademyMarketing]}
    ></MultiProjectsRoutes>
  );
}

export default App
