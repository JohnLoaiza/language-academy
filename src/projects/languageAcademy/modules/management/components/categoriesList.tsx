import { useState } from "react";
import { styles } from "../../../../../styles";
import { CourseCategory } from "../../../models/courseCategory";
import { DynamicForm } from "../../../../../components/form";
import { Collections } from "../../../db/collections";
import { dbConnect } from "../../../db";
import { CategoriesResponse } from "../../../models/backlessResponse";

interface Props {
  categories: CategoriesResponse[] | undefined;
  onSelectCategory: (category: CategoriesResponse) => void;
}

export const CategoriesList = ({ categories, onSelectCategory }: Props) => {
  const [showForm, setShowForm] = useState(false);

  const addCategory = async (name: string) => {
    const category: CourseCategory = {
      name: name,
      courses: []
    }
  var response =  await dbConnect()?.addDocument(Collections.CATEGORIES, category);
  if(response) {
    alert("Categoria creado correctamente")
    setShowForm(false)
  } else {
    alert("No se pudo insertar categoria")
  }
    };
  
  return (<>
  {!showForm ? <div style={styles.mainContainer}>
      <div style={styles.header}>
        <h2 style={styles.title}>Categorías de Cursos</h2>
      </div>

      {categories ? (
        <div style={styles.grid}>
          {categories.map((category) => (
            <div
              key={category.properties.name}
              style={styles.card}
              onClick={() => onSelectCategory(category)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#eff6ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              <div style={styles.cardTitle}>{category.properties.name}</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.loading}>
          <p>Cargando categorías...</p>
        </div>
      )}

      <button
        style={styles.button}
        onClick={()=> setShowForm(true)}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor!;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = styles.button.backgroundColor!;
        }}
      >
        + Nueva Categoría
      </button>
    </div> : <DynamicForm fields={['Nombre']} onSubmit={(data: any) => addCategory(data['Nombre'])} onClose={() => setShowForm(false) }></DynamicForm> /*<CategoryForm onClose={() => setShowForm(false)}></CategoryForm> */}
  </>
  );
};
