import { useState } from "react";
import { Activity, Group } from "../../../models/courseCategory";
import { v4 as uuidv4 } from "uuid";
import { dbConnect } from "../../../db";
import { Collections } from "../../../db/collections";
import { CategoriesResponse } from "../../../models/backlessResponse";

interface Props {
  group: Group;
  onBack: () => void;
  category: CategoriesResponse;
}

export const ActivityList = ({ group,  onBack, category }: Props) => {
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({});
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewActivity((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file); // Simulación
      setNewActivity((prev: any) => ({ ...prev, fileUrl: fakeUrl }));
    }
  };

  const saveActivity = async () => {
    if (!newActivity.title || !newActivity.type || !newActivity.date) {
      alert("Por favor completa los campos obligatorios");
      return;
    }

    const activity: Activity = {
      id: uuidv4(),
      title: newActivity.title!,
      description: newActivity.description ?? "",
      type: newActivity.type as "actividad" | "examen" | "material",
      fileUrl: newActivity.fileUrl,
      submissionUrl: "",
      date: newActivity.date!,
    };

    if (!group.activities) group.activities = [];
    group.activities.push(activity);

    setUploading(true);
    const result = await dbConnect()?.editDocument(Collections.CATEGORIES, category.id, category);
    setUploading(false);

    if (result) {
      alert("Actividad guardada");
      setNewActivity({});
      setShowForm(false);
    } else {
      alert("Error al guardar actividad");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <button
        onClick={onBack}
        style={{ marginBottom: "1rem", backgroundColor: "#6B7280", color: "white", padding: "0.5rem 1rem" }}
      >
        ← Volver
      </button>

      <h2 style={{ marginBottom: "1rem" }}>
        {showForm ? "Agregar nueva actividad" : "Actividades del grupo"}
      </h2>

      <button
        onClick={() => setShowForm((prev) => !prev)}
        style={{ marginBottom: "1rem", padding: "0.5rem 1rem" }}
      >
        {showForm ? "← Ver lista de actividades" : "+ Agregar nueva actividad"}
      </button>

      {!showForm && (
        <>
          {group.activities && group.activities.length > 0 ? (
            group.activities.map((activity) => (
              <div key={activity.id} style={{ border: "1px solid #ddd", padding: "1rem", marginBottom: "1rem" }}>
                <h4>{activity.title}</h4>
                <p><strong>Tipo:</strong> {activity.type}</p>
                <p><strong>Descripción:</strong> {activity.description}</p>
                <p><strong>Fecha:</strong> {activity.date}</p>
                {activity.fileUrl && (
                  <p>
                    <a href={activity.fileUrl} target="_blank" rel="noopener noreferrer">Ver archivo</a>
                  </p>
                )}
              </div>
            ))
          ) : (
            <p>No hay actividades aún.</p>
          )}
        </>
      )}

      {showForm && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: "400px" }}>
          <input
            type="text"
            name="title"
            placeholder="Título"
            value={newActivity.title ?? ""}
            onChange={handleInputChange}
          />
          <textarea
            name="description"
            placeholder="Descripción"
            value={newActivity.description ?? ""}
            onChange={handleInputChange}
          />
          <select name="type" value={newActivity.type ?? ""} onChange={handleInputChange}>
            <option value="">Seleccionar tipo</option>
            <option value="actividad">Actividad</option>
            <option value="examen">Examen</option>
            <option value="material">Material</option>
          </select>
          <input
            type="date"
            name="date"
            value={newActivity.date ?? ""}
            onChange={handleInputChange}
          />
          <input
            type="file"
            onChange={handleFileChange}
          />
          <button onClick={saveActivity} disabled={uploading}>
            {uploading ? "Guardando..." : "Guardar actividad"}
          </button>
        </div>
      )}
    </div>
  );
};
