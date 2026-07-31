import { useState, FormEvent } from "react";

interface FormData {
  nom: string;
  prenom: string;
  email: string;
  sujet: string;
  message: string;
}

export default function Formulaire() {
  const [formData, setFormData] = useState<FormData>({
    nom: "",
    prenom: "",
    email: "",
    sujet: "",
    message: "",
  });

  const [statusMessage, setStatusMessage] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    const key = id === "messageText" ? "message" : id;
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      ...formData,
      created_at: new Date().toISOString(),
    };

    try {
      const response = await fetch(
        "https://n8n-jp2v.onrender.com/webhook/contact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        setStatusMessage("✅ Votre message a bien été envoyé !");
        setFormData({ nom: "", prenom: "", email: "", sujet: "", message: "" });
      } else {
        setStatusMessage("❌ Erreur lors de l'envoi.");
      }
    } catch (error) {
      console.error(error);
      setStatusMessage("❌ Impossible de contacter le serveur.");
    }
  };

  return (
    <div className="container-form">
      <form id="contactForm" onSubmit={handleSubmit}>
        <div className="form-row">
          <input
            type="text"
            id="nom"
            placeholder="Nom"
            value={formData.nom}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            id="prenom"
            placeholder="Prénom"
            value={formData.prenom}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            id="sujet"
            placeholder="Sujet"
            value={formData.sujet}
            onChange={handleChange}
            required
          />
        </div>

        <textarea
          id="messageText"
          placeholder="Votre message"
          value={formData.message}
          onChange={handleChange}
          required
        />

        <button type="submit">Envoyer</button>
      </form>

      <div id="message">{statusMessage}</div>
    </div>
  );
}