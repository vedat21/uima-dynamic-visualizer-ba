import React from "react";

// Custom Modules
import getData from "../../../api_crud/useGetData"

/**
 * component to display a text
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function TextComponent(props) {

   //    const url = "http://localhost:9999/result/text"
   //    const {data, loading} = useGetData(url);


    return (
        <div className="scrollable-text-wrapper" style={{fontSize: "100%"}}> {/* 100 ist standard */}

            Das Ziel ist häufig, Erfahrung und Wissen gemeinschaftlich zu sammeln (kollektive Intelligenz) und in für die Zielgruppe verständlicher Form zu dokumentieren. Die Autoren erarbeiten hierzu gemeinschaftlich Texte, die ggf. durch Fotos oder andere Medien ergänzt werden (kollaboratives Schreiben, E-Collaboration). Ermöglicht wird dies durch ein vereinfachtes Content-Management-System, die sogenannte Wiki-Software oder Wiki-Engine. Ähnlich wie ein mehrdimensionales Spreadsheet einer Tabellenkalkulation ist die Benutzeroberfläche in einen Frame samt Menü und vier Seiten gegliedert, von denen zwei im Schreib-Lese-Modus beschrieben und verändert werden können (Artikelseite und Diskussionsseite) und zwei im Nur-Lese-Modus der Versions- und Kommentardokumentation in Stapelform dienen.

            Das bekannteste Wiki ist die Online-Enzyklopädie Wikipedia, welche die Wiki-Software MediaWiki einsetzt. Zudem nutzen auch viele Unternehmen Wikis als Teil des Wissensmanagementsystems in ihrem Intranet (standortübergreifend), siehe Enterprise Wiki. Ein einzelnes Dokument, eine Wiki-Seite, kann mit wenigen Klicks (Button Bearbeiten und Button Speichern oder Veröffentlichen) geändert werden. Zu diesem Zweck ist die Wiki-Seite zumeist in Form von Wikitext, einer leicht erlernbaren Auszeichnungssprache, gespeichert.

            Die Abbildung rechts oben zeigt den Wikitext dieser Wiki-Seite im Bearbeitungs-Mod
        </div>
    )
}

export default TextComponent;

