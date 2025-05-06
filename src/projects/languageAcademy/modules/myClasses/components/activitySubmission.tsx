import React, { useState } from "react";
import { Activity } from "../../../models/courseCategory";
import { InscriptionsResponse } from "../../../models/backlessResponse";
import { dbConnect } from "../../../db";
import { Collections } from "../../../db/collections";

interface Props {
  activity: Activity;
  inscription: InscriptionsResponse;
  onClose: () => void;
}

export const findMyActivity = (
  inscription: InscriptionsResponse,
  activityId: string
): Activity | undefined =>
  inscription.properties.activities!
    ? inscription.properties.activities!.find((a) => a.id == activityId)
    : undefined;

export const ActivitySubmissionView: React.FC<Props> = ({
  activity,
  inscription,
  onClose,
}) => {
  const myActivity: Activity | undefined = findMyActivity(inscription!, activity.id);

  const [writtenAnswer, setWrittenAnswer] = useState(
    myActivity && myActivity.response ? myActivity.response : ""
  );
  const [file, setFile] = useState<File | null>(null);

  const isSubmitted = !!activity.response || !!activity.submissionUrl;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    const updatedActivity: Activity = {
      ...activity,
      submissionUrl: file ? URL.createObjectURL(file) : "",
      response: writtenAnswer,
    };

    inscription.properties.activities ??= [];
    inscription.properties.activities.push(updatedActivity);

    const response = await dbConnect()?.editDocument(
      Collections.INSCRIPTIONS,
      inscription.id,
      inscription
    );

    if (response) {
      alert("Tarea entregada con éxito");
      onClose();
    } else {
      alert("Error al entregar la tarea");
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        minHeight: "100%",
        backgroundColor: "#f9fafb",
        padding: "2rem",
        zIndex: 10,
        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
      }}
    >
      <h2 style={{ marginBottom: "1rem" }}>Entregar actividad</h2>
      <p>
        <strong>Título:</strong> {activity.title}
      </p>
      <p>
        <strong>Tipo:</strong> {activity.type}
      </p>
      <p>
        <strong>Fecha:</strong> {new Date(activity.date).toLocaleDateString()}
      </p>

      {activity.fileUrl && (
        <p>
          <a
            href={activity.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#3b82f6" }}
          >
            Ver archivo adjunto del docente
          </a>
        </p>
      )}

      <br />
      <label>
        <strong>Descripción:</strong>
      </label>
      <p>{activity.description}</p>

      {isSubmitted ? (
        <div style={{ marginTop: "2rem" }}>
          <h3 style={{ color: "#10b981" }}>Ya entregaste esta actividad</h3>
          {activity.response && (
            <div>
              <p>
                <strong>Tu respuesta:</strong>
              </p>
              <p
                style={{
                  background: "#e5e7eb",
                  padding: "0.5rem",
                  borderRadius: "4px",
                }}
              >
                {activity.response}
              </p>
            </div>
          )}
          {activity.submissionUrl && (
            <p style={{ marginTop: "1rem" }}>
              <a
                href={activity.submissionUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#3b82f6" }}
              >
                Ver archivo entregado
              </a>
            </p>
          )}
        </div>
      ) : (
        <>
          <div style={{ marginTop: "1rem" }}>
            <label>
              <strong>Respuesta:</strong>
            </label>
            <textarea
              value={writtenAnswer}
              onChange={(e) => setWrittenAnswer(e.target.value)}
              placeholder="Escribe tu respuesta aquí..."
              style={{
                width: "100%",
                height: "100px",
                marginTop: "0.5rem",
                padding: "0.5rem",
              }}
            />
          </div>

          <div style={{ marginTop: "1rem" }}>
            <label>
              <strong>Subir archivo:</strong>
            </label>
            <br></br>
            {myActivity && myActivity.submissionUrl && (
              <button
                style={{
                  backgroundColor: "#10b981",
                  color: "white",
                  padding: "0.5rem 1rem",
                  border: "none",
                  borderRadius: "6px",
                }}
                onClick={() => window.open(myActivity.submissionUrl)}
              >
                {"Ver archivo adjunto"}
              </button>
            )}
            <input
              type="file"
              onChange={handleFileChange}
              style={{ display: "block", marginTop: "0.5rem" }}
            />
          </div>

          <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
            <button
              style={{
                backgroundColor: "#10b981",
                color: "white",
                padding: "0.5rem 1rem",
                border: "none",
                borderRadius: "6px",
              }}
              onClick={handleSubmit}
            >
              Enviar entrega
            </button>
            <button
              style={{
                backgroundColor: "#ef4444",
                color: "white",
                padding: "0.5rem 1rem",
                border: "none",
                borderRadius: "6px",
              }}
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </>
      )}
    </div>
  );
};
